import type { Metadata } from 'next/types'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post, Category } from '@/payload-types'
import { PostsGrid, type PostItem, type BlogCategory, type PostSub, type CategoryNode } from './PostsGrid'

export const dynamic = 'force-static'
export const revalidate = 600

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const asCategory = (c: unknown): Category | null =>
  c && typeof c === 'object' && 'title' in c ? (c as Category) : null

// Pour un article : niveau 1 = pôles (parent de la catégorie, ou la catégorie si racine),
// niveau 2 = sous-catégories (les catégories qui ont un parent).
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

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2, // peuple categories[].parent (pour le 2e niveau)
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
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
    // Chemin lisible : « Pôle › Sous-catégorie » si une sous-catégorie existe, sinon le pôle seul.
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
      date: formatDate(p.publishedAt),
      categoryPath,
      poles,
      subs,
    }
  })

  // Arbre des catégories réellement présentes : pôles (niveau 1) + leurs sous-catégories (niveau 2)
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
        <PostsGrid posts={items} tree={tree} />
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
