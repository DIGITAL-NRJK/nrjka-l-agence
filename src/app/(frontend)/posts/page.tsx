import type { Metadata } from 'next/types'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post, Media, Category } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const firstCategory = (post: Post): string | undefined => {
  const c = post.categories?.[0]
  return c && typeof c === 'object' && 'title' in c ? (c as Category).title : undefined
}

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 24,
    overrideAccess: false,
    sort: '-publishedAt',
    select: { title: true, slug: true, categories: true, meta: true, publishedAt: true },
  })

  const docs = posts.docs as Post[]
  const [featured, ...rest] = docs

  return (
    <section className="container pt-28 pb-24 sm:pt-32">
      {/* En-tête */}
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

      {docs.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          Les premiers articles arrivent bientôt.
        </p>
      ) : (
        <>
          {/* Article à la une */}
          {featured && (
            <Link
              href={`/posts/${featured.slug}`}
              className="group mt-14 block rounded-3xl border border-border bg-surface-soft p-8 transition-all hover:border-terracotta/40 sm:p-10"
            >
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-terracotta-dark">
                {firstCategory(featured) && <span>{firstCategory(featured)}</span>}
                <span className="text-slate">{formatDate(featured.publishedAt)}</span>
              </div>
              <h2 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-terracotta-dark sm:text-3xl">
                {featured.title}
              </h2>
              {featured.meta?.description && (
                <p className="mt-3 max-w-2xl leading-relaxed text-slate">
                  {featured.meta.description}
                </p>
              )}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-all group-hover:gap-2.5">
                Lire l’article
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </span>
            </Link>
          )}

          {/* Grille des autres articles */}
          {rest.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-terracotta/40"
                >
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-terracotta-dark">
                    {firstCategory(post) && <span>{firstCategory(post)}</span>}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-terracotta-dark">
                    {post.title}
                  </h3>
                  {post.meta?.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">
                      {post.meta.description}
                    </p>
                  )}
                  <span className="mt-auto pt-4 text-xs text-slate">{formatDate(post.publishedAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </>
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
