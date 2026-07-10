import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'

import type { Post, Media, Category } from '@/payload-types'
import RichText from '@/components/RichText'
import { readingTimeLabel } from '@/utilities/readingTime'
import { authorSlug } from '@/utilities/authorSlug'
import { ShareButtons } from '@/components/ShareButtons'
import { JsonLd } from '@/components/JsonLd'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta, getImageURL } from '@/utilities/generateMeta'
import { getLocalizedPaths } from '@/utilities/localizedSlugs'
import { getServerSideURL } from '@/utilities/getURL'
import { LOCALES } from '@/utilities/i18n'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    locale: 'all',
    select: { slug: true },
  })
  return posts.docs.flatMap((doc) => {
    const slugByLocale = (doc as unknown as { slug?: Record<string, string> }).slug || {}
    return LOCALES.map((locale) => ({ locale, slug: slugByLocale[locale] })).filter((p) => p.slug)
  })
}

type Args = { params: Promise<{ locale: string; slug?: string }> }

const formatDate = (d?: string | null, locale = 'fr') =>
  d
    ? new Date(d).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

const firstCategory = (post: Post): string | undefined => {
  const c = post.categories?.[0]
  return c && typeof c === 'object' && 'title' in c ? (c as Category).title : undefined
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'fr', slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug, locale })

  if (!post) return <PayloadRedirects url={url} />

  const img = post.heroImage && typeof post.heroImage === 'object' ? (post.heroImage as Media) : null
  const origin = getServerSideURL()
  const absoluteUrl = `${origin}/${locale}${url}`

  const authorNames = (post.populatedAuthors || [])
    .map((a) => (a && typeof a === 'object' && 'name' in a ? (a as { name?: string }).name : undefined))
    .filter((n): n is string => Boolean(n))

  const readTime = readingTimeLabel(post.content, locale)

  // Données structurées : article (BlogPosting) + fil d'Ariane (BreadcrumbList).
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.meta?.description ? { description: post.meta.description } : {}),
    image: getImageURL(post.heroImage),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt || post.publishedAt || undefined,
    ...(authorNames.length
      ? { author: authorNames.map((name) => ({ '@type': 'Person', name })) }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: 'NRJKA Digital',
      logo: { '@type': 'ImageObject', url: `${origin}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl },
    inLanguage: locale === 'en' ? 'en' : 'fr',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Home' : 'Accueil', item: `${origin}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'en' ? 'Blog' : 'Le blog', item: `${origin}/${locale}/posts` },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl },
    ],
  }

  const suggestions = (post.relatedPosts || []).filter((p): p is Post => typeof p === 'object')
  if (suggestions.length < 3) {
    try {
      const payload = await getPayload({ config: configPromise })
      const recent = await payload.find({
        collection: 'posts',
        where: { slug: { not_equals: post.slug } },
        sort: '-publishedAt',
        limit: 4,
        depth: 0,
        overrideAccess: false,
        locale: locale as 'fr' | 'en',
        select: { title: true, slug: true },
      })
      const have = new Set(suggestions.map((p) => p.id))
      for (const r of recent.docs as Post[]) {
        if (suggestions.length >= 4) break
        if (!have.has(r.id)) suggestions.push(r)
      }
    } catch {
      /* fallback silencieux */
    }
  }

  let relatedService: { title: string; slug: string } | null = null
  try {
    const payload = await getPayload({ config: configPromise })
    const svc = await payload.find({
      collection: 'services',
      where: { related_articles: { equals: post.id } },
      limit: 1,
      depth: 0,
      locale: locale as 'fr' | 'en',
    })
    if (svc.docs[0]) {
      relatedService = {
        title: svc.docs[0].title as string,
        slug: svc.docs[0].slug as string,
      }
    }
  } catch {
    relatedService = null
  }

  return (
    <article className="pt-16 pb-24 sm:pt-20">
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* En-tête */}
      <header className="container">
        <Link
          href={`/${locale}/posts`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          {locale === 'en' ? 'The blog' : 'Le blog'}
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.14em] text-terracotta-dark">
            {firstCategory(post) && <span>{firstCategory(post)}</span>}
            <span className="text-slate">{formatDate(post.publishedAt, locale)}</span>
            <span aria-hidden className="text-slate/50">·</span>
            <span className="text-slate">{readTime}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          {authorNames.length > 0 && (
            <p className="mt-4 text-sm text-slate">
              {locale === 'en' ? 'By' : 'Par'}{' '}
              {authorNames.map((name, i) => (
                <React.Fragment key={name}>
                  <Link
                    href={`/${locale}/auteur/${authorSlug(name)}`}
                    className="font-medium text-ink underline underline-offset-4 transition-colors hover:text-terracotta-dark"
                  >
                    {name}
                  </Link>
                  {i < authorNames.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </p>
          )}
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

      {/* Corps */}
      <div className="container mt-12 lg:grid lg:grid-cols-[1fr_15rem] lg:gap-14">
        <div>
          <RichText className="mx-0 max-w-2xl" data={post.content} enableGutter={false} />
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="space-y-10 lg:sticky lg:top-24">
            <ShareButtons url={absoluteUrl} title={post.title} />

            {suggestions.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                  <span className="h-px w-6 bg-terracotta" />
                  {locale === 'en' ? 'Also read' : 'À lire aussi'}
                </h2>
                <ul className="space-y-4">
                  {suggestions.slice(0, 4).map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/${locale}/posts/${p.slug}`}
                        className="group block text-sm font-medium leading-snug text-ink transition-colors hover:text-terracotta-dark"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* CTA contextuel */}
      <div className="container mt-20">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-brand px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              {relatedService
                ? (locale === 'en' ? `Need help with ${relatedService.title}?` : `Un besoin en ${relatedService.title} ?`)
                : (locale === 'en' ? 'Have a project in mind?' : 'Un projet en tête ?')}
            </h2>
            <p className="mt-1 text-white/70">
              {locale === 'en'
                ? 'First call is free and non-binding.'
                : 'Le premier échange est gratuit, et sans engagement.'}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {relatedService && (
              <Link
                href={`/${locale}/services/${relatedService.slug}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/20 px-6 py-3 font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                {locale === 'en' ? 'Discover the service' : 'Découvrir le service'}
              </Link>
            )}
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
            >
              {locale === 'en' ? 'Request an audit' : 'Demander un audit'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale = 'fr', slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug), locale })
  const localizedPaths = post?.id
    ? await getLocalizedPaths('posts', post.id, (s) => `/posts/${s}`)
    : undefined
  return generateMeta({ doc: post, canonicalPath: `/posts/${slug}`, locale, localizedPaths })
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale: locale as 'fr' | 'en',
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
