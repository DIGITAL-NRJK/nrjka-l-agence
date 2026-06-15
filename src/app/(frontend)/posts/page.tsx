import type { Metadata } from 'next/types'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post, Category } from '@/payload-types'
import { PostsGrid, type PostItem, type BlogCategory } from './PostsGrid'

export const dynamic = 'force-static'
export const revalidate = 600

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const firstCategory = (post: Post): { slug?: string; title?: string } => {
  const c = post.categories?.[0]
  if (c && typeof c === 'object' && 'title' in c) {
    const cat = c as Category
    return { slug: cat.slug ?? undefined, title: cat.title }
  }
  return {}
}

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
    select: { title: true, slug: true, categories: true, meta: true, publishedAt: true },
  })

  const items: PostItem[] = (posts.docs as Post[]).map((p) => {
    const cat = firstCategory(p)
    return {
      id: String(p.id),
      slug: p.slug as string,
      title: p.title,
      excerpt: p.meta?.description,
      date: formatDate(p.publishedAt),
      categorySlug: cat.slug ?? null,
      categoryTitle: cat.title ?? null,
    }
  })

  // Catégories réellement présentes dans les articles
  const seen = new Map<string, string>()
  for (const it of items) if (it.categorySlug && it.categoryTitle) seen.set(it.categorySlug, it.categoryTitle)
  const categories: BlogCategory[] = Array.from(seen.entries()).map(([slug, title]) => ({ slug, title }))

  return (
    <section className="container pt-28 pb-24 sm:pt-32">
      <div className="max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          Le blog
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Ressources & conseils
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate">
          Nos analyses pour y voir clair dans le digital — sans jargon, avec des sources fiables.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          Les premiers articles arrivent bientôt.
        </p>
      ) : (
        <PostsGrid posts={items} categories={categories} />
      )}
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blog — Ressources & conseils | NRJKA',
    description:
      'Analyses et conseils sur le web, le SEO, l’automatisation et la marque — pour TPE, PME, artisans et associations.',
  }
}
