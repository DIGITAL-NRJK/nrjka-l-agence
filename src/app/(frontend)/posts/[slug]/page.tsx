import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'

import type { Post, Media, Category } from '@/payload-types'
import RichText from '@/components/RichText'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const firstCategory = (post: Post): string | undefined => {
  const c = post.categories?.[0]
  return c && typeof c === 'object' && 'title' in c ? (c as Category).title : undefined
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const img = post.heroImage && typeof post.heroImage === 'object' ? (post.heroImage as Media) : null
  const related = (post.relatedPosts || []).filter(
    (p): p is Post => typeof p === 'object',
  )

  return (
    <article className="pt-28 pb-24 sm:pt-32">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* En-tête */}
      <header className="container">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          Le blog
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-terracotta-dark">
            {firstCategory(post) && <span>{firstCategory(post)}</span>}
            <span className="text-slate">{formatDate(post.publishedAt)}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          {post.meta?.description && (
            <p className="mt-5 text-lg leading-relaxed text-slate">{post.meta.description}</p>
          )}
        </div>

        {img?.url && (
          <div className="mt-10 overflow-hidden rounded-3xl bg-surface-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || post.title} className="aspect-16/9 w-full object-cover" />
          </div>
        )}
      </header>

      {/* Contenu */}
      <div className="container mt-12">
        <RichText className="mx-auto max-w-2xl" data={post.content} enableGutter={false} />
      </div>

      {/* Articles liés */}
      {related.length > 0 && (
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">À lire aussi</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/posts/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface-soft p-6 transition-all hover:-translate-y-1 hover:border-terracotta/40"
              >
                <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-terracotta-dark">
                  {p.title}
                </h3>
                {p.meta?.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">
                    {p.meta.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="container mt-20">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-brand px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Un projet en tête ?
            </h2>
            <p className="mt-1 text-white/70">Le premier échange est gratuit, et sans engagement.</p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
          >
            Demander un audit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
