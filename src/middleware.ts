import { NextRequest, NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/utilities/i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (hasLocale) return NextResponse.next()

  // pathname '/' donnait '/fr/' → 2e redirection (Lighthouse : ~920 ms perdues).
  const url = new URL(`/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`, request.url)
  url.search = request.nextUrl.search
  // 308 (permanent) : la redirection vers la locale par défaut est structurelle,
  // ce qui transmet mieux les signaux SEO qu'un 307 temporaire.
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Exclude: Next.js internals, Payload admin/api, preview routes, seed, static assets, sitemaps
  matcher: [
    '/((?!_next|api|admin|next|seed-services|favicon\\.ico|favicon\\.svg|robots\\.txt|[\\w-]+-sitemap\\.xml|opengraph-image).*)',
  ],
}
