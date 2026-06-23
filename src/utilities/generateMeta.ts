import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { LOCALES, DEFAULT_LOCALE } from './i18n'
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

  // URL canonique auto-référente de la page courante (préfixée par la locale).
  const localizedUrl =
    canonicalPath !== undefined ? `${serverUrl}/${locale}${canonicalPath}` : undefined

  const alternates =
    canonicalPath !== undefined
      ? {
          canonical: localizedUrl,
          languages: {
            ...Object.fromEntries(
              LOCALES.map((l) => [l, `${serverUrl}/${l}${canonicalPath}`]),
            ),
            // x-default : version servie quand la langue du visiteur ne correspond à aucune locale.
            'x-default': `${serverUrl}/${DEFAULT_LOCALE}${canonicalPath}`,
          } as Record<string, string>,
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
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      siteName,
      title,
      url: localizedUrl || '/',
    }),
    title,
    ...(alternates ? { alternates } : {}),
  }
}
