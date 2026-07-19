import { getSiteSettings } from './getSiteSettings'
import { LOCALES } from './i18n'

/**
 * Version anglaise désactivable (Paramètres du site › Langues).
 * Quand `englishEnabled` est décoché : /en redirige vers le FR, le sélecteur de langue
 * est masqué et les hreflang/sitemaps/RSS anglais sont retirés. L'admin reste bilingue.
 */

type WithLanguages = { languages?: { englishEnabled?: boolean | null } | null } | null

/** Lecture synchrone du flag depuis un global déjà chargé (évite un fetch en double). */
export const englishEnabledFrom = (settings: unknown): boolean =>
  (settings as WithLanguages)?.languages?.englishEnabled !== false

/** `true` par défaut (global absent, champ jamais renseigné → EN accessible). */
export async function isEnglishEnabled(): Promise<boolean> {
  return englishEnabledFrom(await getSiteSettings('fr'))
}

/** Locales publiquement servies — à passer aux hreflang. */
export async function getActiveLocales(): Promise<string[]> {
  return (await isEnglishEnabled()) ? [...LOCALES] : LOCALES.filter((l) => l !== 'en')
}

/** Filtre une map hreflang inline `{ fr: '/fr/x', en: '/en/y' }` selon le toggle. */
export async function localizedLanguages(
  map: Record<string, string>,
): Promise<Record<string, string>> {
  if (await isEnglishEnabled()) return map
  const { en: _en, ...rest } = map
  return rest
}
