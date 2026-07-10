import type { Metadata } from 'next/types'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post, Category } from '@/payload-types'
import { authorSlug } from '@/utilities/authorSlug'
import { LOCALES } from '@/utilities/i18n'
import {
  PostsGrid,
  type PostItem,
  type BlogCategory,
  type PostSub,
} from '../../../posts/PostsGrid'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = { params: Promise<{ locale: string; slug: string }> }

const formatDate = (d?: string | null, locale = 'fr') =>
  d
    ? new Date(d).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

const asCategory = (c: unknown): Category | null =>
  c && typeof c === 'object' && 'title' in c ? (c as Category) : null

const postTaxonomy = (post: Post): { poles: BlogCategory[]; subs: PostSub[] } => {
  const poles = new Map<string, string>()
  const subs = new Map<string, PostSub>()
  for (const raw of post.categories || []) {
    const cat = asCategory(raw)
    if (!cat?.slug) continue
    const parent = asCategory((cat as Category & { parent?: unknown }).parent)
    if (parent?.slug) {
      poles.set(parent.slug, parent.title)
      subs.set(cat.slug, { slug: cat.slug, title: cat.title, parentSlug: parent.slug })
    } else {
      poles.set(cat.slug, cat.title)
    }
  }
  return {
    poles: Array.from(poles.entries()).map(([slug, title]) => ({ slug, title })),
    subs: Array.from(subs.values()),
  }
}

// Retrouve l'auteur par slug (nom slugifié). N'expose QUE l'id + le nom (vie privée).
const queryAuthor = cache(async (slug: string): Promise<{ id: string | number; name: string } | null> => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'users',
    limit: 200,
    pagination: false,
    depth: 0,
    overrideAccess: true,
    select: { name: true },
  })
  const match = (res.docs as { id: string | number; name?: string | null }[]).find(
    (u) => u.name && authorSlug(u.name) === slug,
  )
  return match?.name ? { id: match.id, name: match.name } : null
})

export default async function AuthorPage({ params }: Args) {
  const { locale, slug } = await params
  const en = locale === 'en'
  const author = await queryAuthor(decodeURIComponent(slug))
  if (!author) notFound()

  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 100,
    overrideAccess: false,
    sort: '-publishedAt',
    locale: locale as 'fr' | 'en',
    where: { authors: { in: [author.id] } },
    select: { title: true, slug: true, categories: true, meta: true, publishedAt: true },
  })

  const items: PostItem[] = (posts.docs as Post[]).map((p) => {
    const { poles, subs } = postTaxonomy(p)
    let categoryPath = poles[0]?.title ?? null
    if (subs[0]) {
      const parentTitle = poles.find((pole) => pole.slug === subs[0].parentSlug)?.title
      categoryPath = parentTitle ? `${parentTitle} › ${subs[0].title}` : subs[0].title
    }
    return {
      id: String(p.id),
      slug: p.slug as string,
      title: p.title,
      excerpt: p.meta?.description,
      date: formatDate(p.publishedAt, locale),
      categoryPath,
      poles,
      subs,
    }
  })

  const count = items.length
  const countLabel = en
    ? `${count} article${count > 1 ? 's' : ''}`
    : `${count} article${count > 1 ? 's' : ''}`

  return (
    <section className="container pt-16 pb-24 sm:pt-20">
      <div className="max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {en ? 'Author' : 'Auteur'}
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {author.name}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate">
          {en ? `Articles written by ${author.name} — ${countLabel}.` : `Articles rédigés par ${author.name} — ${countLabel}.`}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          {en ? 'No articles yet.' : 'Aucun article pour le moment.'}
        </p>
      ) : (
        <PostsGrid posts={items} tree={[]} locale={locale} />
      )}
    </section>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'posts',
    limit: 500,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  const slugs = new Set<string>()
  for (const p of res.docs as { populatedAuthors?: { name?: string | null }[] }[]) {
    for (const a of p.populatedAuthors || []) {
      if (a?.name) slugs.add(authorSlug(a.name))
    }
  }
  return Array.from(slugs).flatMap((slug) => LOCALES.map((locale) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const en = locale === 'en'
  const author = await queryAuthor(decodeURIComponent(slug))
  if (!author) return {}
  return {
    title: en ? `${author.name} — Author | NRJKA` : `${author.name} — Auteur | NRJKA`,
    description: en
      ? `Articles and insights written by ${author.name} for NRJKA.`
      : `Articles et analyses rédigés par ${author.name} pour NRJKA.`,
    alternates: {
      languages: {
        fr: `/fr/auteur/${slug}`,
        en: `/en/auteur/${slug}`,
      },
    },
  }
}
