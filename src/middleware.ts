import { NextRequest, NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/utilities/i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (hasLocale) return NextResponse.next()

  const url = new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
  url.search = request.nextUrl.search
  return NextResponse.redirect(url, 307)
}

export const config = {
  // Exclude: Next.js internals, Payload admin/api, preview routes, seed, static assets, sitemaps
  matcher: [
    '/((?!_next|api|admin|next|seed-services|favicon\\.ico|favicon\\.svg|robots\\.txt|[\\w-]+-sitemap\\.xml|opengraph-image).*)',
  ],
}
