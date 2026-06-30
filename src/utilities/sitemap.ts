import { LOCALES, DEFAULT_LOCALE } from './i18n'

export type LocalizedSitemapEntry = {
  /**
   * Chemin partagé (après /[locale]) quand le slug n'est PAS localisé — ex. '' (accueil),
   * '/posts' (index), '/services/mon-service'. Utilisé pour toutes les langues.
   */
  path?: string
  /**
   * Chemins par langue quand le slug EST localisé — ex. { fr: '/posts/x-fr', en: '/posts/x-en' }.
   * Prioritaire sur `path` langue par langue.
   */
  paths?: Partial<Record<string, string>>
  /** Date ISO de dernière modif. */
  lastmod?: string
}

/**
 * Construit des entrées de sitemap multilingues.
 * Pour chaque page : une entrée par langue disponible (URL canonique préfixée /fr ou /en, avec le
 * bon slug par langue), annotée des alternates hreflang (toutes les langues + x-default).
 * Indispensable pour que Google indexe les deux langues sans contenu dupliqué, slug localisé compris.
 */
export function buildLocalizedSitemap(siteUrl: string, entries: LocalizedSitemapEntry[]) {
  const fallback = new Date().toISOString()

  return entries.flatMap(({ path, paths, lastmod }) => {
    const pathFor = (l: string): string | undefined => {
      const p = paths?.[l] ?? path
      return p === '/' ? '' : p
    }

    const availableLocales = LOCALES.filter((l) => pathFor(l) !== undefined)
    if (availableLocales.length === 0) return []

    const xDefaultPath = pathFor(DEFAULT_LOCALE) ?? pathFor(availableLocales[0])

    const alternateRefs = [
      ...availableLocales.map((l) => ({
        href: `${siteUrl}/${l}${pathFor(l)}`,
        hreflang: l,
        hrefIsAbsolute: true,
      })),
      {
        href: `${siteUrl}/${DEFAULT_LOCALE}${xDefaultPath}`,
        hreflang: 'x-default',
        hrefIsAbsolute: true,
      },
    ]

    return availableLocales.map((locale) => ({
      loc: `${siteUrl}/${locale}${pathFor(locale)}`,
      lastmod: lastmod || fallback,
      alternateRefs,
    }))
  })
}

/** Construit la map { fr: buildPath(slugFr), en: buildPath(slugEn) } depuis un doc récupéré en locale:'all'. */
export function localizedPathsFromDoc(
  doc: { slug?: unknown },
  buildPath: (slug: string) => string,
): Partial<Record<string, string>> {
  const slugByLocale = (doc?.slug ?? {}) as Record<string, string>
  const out: Partial<Record<string, string>> = {}
  for (const l of LOCALES) {
    const s = slugByLocale?.[l]
    if (s) out[l] = buildPath(s)
  }
  return out
}
