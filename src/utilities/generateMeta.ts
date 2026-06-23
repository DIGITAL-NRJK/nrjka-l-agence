import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { LOCALES } from './i18n'
import { getSiteSettings } from './getSiteSettings'

export const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  /** canonical path after the locale prefix, e.g. '' for home, '/contact', '/posts/my-slug' */
  canonicalPath?: string
  /** locale active — sert à lire les valeurs SEO par défaut localisées */
  locale?: string
}): Promise<Metadata> => {
  const { doc, canonicalPath, locale = 'fr' } = args

  const settings = await getSiteSettings(locale)
  const seo = settings?.seo

  const siteName = seo?.siteName?.trim() || 'NRJKA Digital'
  const suffix = seo?.titleSuffix?.trim()

  // Image OG : celle du document, sinon l'image par défaut des Paramètres, sinon le fallback statique.
  const ogImage = getImageURL(doc?.meta?.image || seo?.defaultOgImage)

  const description =
    doc?.meta?.description || seo?.defaultMetaDescription?.trim() || undefined

  const title = doc?.meta?.title
    ? suffix
      ? `${doc.meta.title} ${suffix}`
      : doc.meta.title
    : seo?.defaultMetaTitle?.trim() || `${siteName} — Agence web & transformation digitale`

  const serverUrl = getServerSideURL()
  const alternates =
    canonicalPath !== undefined
      ? {
          languages: Object.fromEntries(
            LOCALES.map((locale) => [locale, `${serverUrl}/${locale}${canonicalPath}`]),
          ) as Record<string, string>,
        }
      : undefined

  return {
    description,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      siteName,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
    ...(alternates ? { alternates } : {}),
  }
}
