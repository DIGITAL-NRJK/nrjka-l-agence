import { LOCALES, DEFAULT_LOCALE } from './i18n'

export type LocalizedSitemapEntry = {
  /** Chemin APRÈS le préfixe de locale, ex. '' (accueil), '/contact', '/posts/mon-slug'. */
  path: string
  /** Date ISO de dernière modif. */
  lastmod?: string
}

/**
 * Construit des entrées de sitemap multilingues.
 * Pour chaque page : une entrée par locale (URL canonique préfixée /fr ou /en),
 * chacune annotée des alternates hreflang (toutes les locales + x-default).
 * Indispensable pour que Google indexe les deux langues sans contenu dupliqué.
 */
export function buildLocalizedSitemap(siteUrl: string, entries: LocalizedSitemapEntry[]) {
  const fallback = new Date().toISOString()

  return entries.flatMap(({ path, lastmod }) => {
    const clean = path === '/' ? '' : path

    const alternateRefs = [
      ...LOCALES.map((l) => ({
        href: `${siteUrl}/${l}${clean}`,
        hreflang: l,
        hrefIsAbsolute: true,
      })),
      {
        href: `${siteUrl}/${DEFAULT_LOCALE}${clean}`,
        hreflang: 'x-default',
        hrefIsAbsolute: true,
      },
    ]

    return LOCALES.map((locale) => ({
      loc: `${siteUrl}/${locale}${clean}`,
      lastmod: lastmod || fallback,
      alternateRefs,
    }))
  })
}
