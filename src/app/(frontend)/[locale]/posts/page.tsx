import type { Metadata } from 'next/types'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post, Category } from '@/payload-types'
import { PostsGrid, type PostItem, type BlogCategory, type PostSub, type CategoryNode } from '../../posts/PostsGrid'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = { params: Promise<{ locale: string }> }

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

export default async function Page({ params }: Args) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
    locale: locale as 'fr' | 'en',
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
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

  const treeMap = new Map<string, { title: string; subs: Map<string, string> }>()
  for (const it of items) {
    for (const pole of it.poles) {
      if (!treeMap.has(pole.slug)) treeMap.set(pole.slug, { title: pole.title, subs: new Map() })
    }
    for (const sub of it.subs) {
      const node = treeMap.get(sub.parentSlug)
      if (node) node.subs.set(sub.slug, sub.title)
    }
  }
  const tree: CategoryNode[] = Array.from(treeMap.entries())
    .map(([slug, v]) => ({
      slug,
      title: v.title,
      subs: Array.from(v.subs.entries())
        .map(([s, t]) => ({ slug: s, title: t }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <section className="container pt-16 pb-24 sm:pt-20">
      <div className="max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {locale === 'en' ? 'The blog' : 'Le blog'}
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {locale === 'en' ? 'Resources & insights' : 'Ressources & conseils'}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate">
          {locale === 'en'
            ? 'Our analyses for clarity in the digital world — no jargon, with reliable sources.'
            : 'Nos analyses pour y voir clair dans le digital — sans jargon, avec des sources fiables.'}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          {locale === 'en' ? 'First articles coming soon.' : 'Les premiers articles arrivent bientôt.'}
        </p>
      ) : (
        <PostsGrid posts={items} tree={tree} locale={locale} />
      )}
    </section>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  return {
    title:
      locale === 'en'
        ? 'Blog — Resources & insights | NRJKA'
        : 'Blog — Ressources & conseils | NRJKA',
    description:
      locale === 'en'
        ? 'Analyses and insights on the web, SEO, automation and branding.'
        : "Analyses et conseils sur le web, le SEO, l’automatisation et la marque.",
    alternates: {
      languages: { fr: '/fr/posts', en: '/en/posts' },
    },
  }
}
