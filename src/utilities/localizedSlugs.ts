import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { getServerSideURL } from './getURL'
import { LOCALES, DEFAULT_LOCALE } from './i18n'

type LocalizedCollection = 'pages' | 'posts' | 'expertises' | 'case-studies'

/**
 * Récupère le chemin (après le préfixe /[locale]) de CHAQUE langue pour un document
 * à slug localisé. Indispensable pour des hreflang/canonical et des sitemaps corrects
 * quand l'URL diffère selon la langue (ex. /fr/a-propos vs /en/about).
 * Repli silencieux sur {} en cas d'erreur.
 */
export async function getLocalizedPaths(
  collection: LocalizedCollection,
  id: number | string,
  buildPath: (slug: string) => string,
): Promise<Partial<Record<string, string>>> {
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.findByID({
      collection,
      id,
      depth: 0,
      locale: 'all',
      overrideAccess: false,
      select: { slug: true },
    })
    const slugByLocale = ((doc as unknown as { slug?: Record<string, string> })?.slug ??
      {}) as Record<string, string>
    const out: Partial<Record<string, string>> = {}
    for (const l of LOCALES) {
      const s = slugByLocale?.[l]
      if (s) out[l] = buildPath(s)
    }
    return out
  } catch {
    return {}
  }
}

/**
 * Construit l'objet `alternates` de Next (canonical auto-référent + hreflang par langue + x-default).
 * - `localizedPaths` : chemins par langue quand le slug est localisé.
 * - `fallbackPath` : chemin partagé quand le slug n'est PAS localisé (ex. services) ou repli.
 * Renvoie `undefined` si aucun chemin n'est disponible pour la locale courante.
 */
export function buildLanguageAlternates(opts: {
  locale: string
  localizedPaths?: Partial<Record<string, string>>
  fallbackPath?: string
}): { canonical: string; languages: Record<string, string> } | undefined {
  const { locale, localizedPaths, fallbackPath } = opts
  const serverUrl = getServerSideURL()
  const pathFor = (l: string) => localizedPaths?.[l] ?? fallbackPath
  const current = pathFor(locale)
  if (current === undefined) return undefined

  return {
    canonical: `${serverUrl}/${locale}${current}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${serverUrl}/${l}${pathFor(l) ?? current}`])),
      // x-default : version servie quand la langue du visiteur ne correspond à aucune locale.
      'x-default': `${serverUrl}/${DEFAULT_LOCALE}${pathFor(DEFAULT_LOCALE) ?? current}`,
    } as Record<string, string>,
  }
}
