export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'fr'

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}
