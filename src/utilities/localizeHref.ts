import { LOCALES } from '@/utilities/i18n'

// Préfixe un lien interne avec la locale active pour éviter la redirection 308 du
// middleware (coût crawl + latence de navigation). Laisse intacts : liens externes,
// ancres, mailto/tel, et liens déjà préfixés. `/home` (slug de la page d'accueil)
// est normalisé vers la racine de la locale.
export function localizeHref(href: string | null | undefined, locale: string): string {
  if (!href || href === '/' || href === '/home') return `/${locale}`
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (LOCALES.some((l) => href === `/${l}` || href.startsWith(`/${l}/`))) return href
  return `/${locale}${href}`
}
