import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getLocalizedPaths } from '@/utilities/localizedSlugs'
import { LOCALES } from '@/utilities/i18n'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    locale: 'all',
    select: { slug: true },
  })

  return pages.docs.flatMap((doc) => {
    const slugByLocale = (doc as unknown as { slug?: Record<string, string> }).slug || {}
    return LOCALES.map((locale) => ({ locale, slug: slugByLocale[locale] })).filter(
      (p) => p.slug && p.slug !== 'home',
    )
  })
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'fr', slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({ slug: decodedSlug, locale })

  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  // Blocs « pleine largeur » de clôture (fond coloré full-bleed) : ils doivent coller
  // au footer, sans le rembourrage bas de l'article qui créerait une bande crème.
  const FLUSH_BOTTOM_BLOCKS = new Set(['ctaFinal', 'contact'])
  const lastBlock = Array.isArray(layout) ? layout[layout.length - 1] : undefined
  const flushBottom =
    !!lastBlock && FLUSH_BOTTOM_BLOCKS.has((lastBlock as { blockType?: string }).blockType ?? '')

  const articleClass =
    hero?.type === 'homeNRJKA' ? '' : flushBottom ? 'pt-16' : 'pt-16 pb-24'

  return (
    <article className={articleClass}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} locale={locale} draft={draft} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale = 'fr', slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({ slug: decodedSlug, locale })
  const canonicalPath = decodedSlug === 'home' ? '' : `/${decodedSlug}`
  const localizedPaths = page?.id
    ? await getLocalizedPaths('pages', page.id, (s) => (s === 'home' ? '' : `/${s}`))
    : undefined
  return generateMeta({ doc: page, canonicalPath, locale, localizedPaths })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale: locale as 'fr' | 'en',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
