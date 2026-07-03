import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getSiteSettings } from './getSiteSettings'
import { buildLanguageAlternates } from './localizedSlugs'

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
  /** chemins par langue (après /[locale]) quand le slug est localisé ; sinon canonicalPath partagé */
  localizedPaths?: Partial<Record<string, string>>
}): Promise<Metadata> => {
  const { doc, canonicalPath, locale = 'fr', localizedPaths } = args

  const settings = await getSiteSettings(locale)
  const seo = settings?.seo

  const siteName = seo?.siteName?.trim() || 'NRJKA Digital'
  const suffix = seo?.titleSuffix?.trim()

  // Image OG : celle du document, sinon l'image par défaut des Paramètres, sinon le fallback statique.
  const ogImage = getImageURL(doc?.meta?.image || seo?.defaultOgImage)

  // Filet de sécurité : une meta description est toujours présente, même si le SEO
  // par page et le SEO par défaut (Paramètres du site) sont vides — évite le manque
  // signalé par Lighthouse / Search Console.
  const fallbackDescription =
    locale === 'en'
      ? 'NRJKA — human-scale digital agency: websites, SEO, automation and CRM for sustainable growth.'
      : 'NRJKA — agence digitale à taille humaine : sites web, SEO, automatisation et CRM pour une croissance durable.'
  const description =
    doc?.meta?.description || seo?.defaultMetaDescription?.trim() || fallbackDescription

  const title = doc?.meta?.title
    ? suffix
      ? `${doc.meta.title} ${suffix}`
      : doc.meta.title
    : seo?.defaultMetaTitle?.trim() || `${siteName} — Agence web & transformation digitale`

  // Canonical + hreflang par langue. Gère le slug localisé (URL EN ≠ FR) via localizedPaths.
  const alternates = buildLanguageAlternates({ locale, localizedPaths, fallbackPath: canonicalPath })

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
      url: alternates?.canonical || '/',
    }),
    title,
    ...(alternates ? { alternates } : {}),
  }
}
