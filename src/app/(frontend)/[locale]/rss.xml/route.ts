import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Flux RSS 2.0 du blog, par langue : /fr/rss.xml et /en/rss.xml.
 * Route handler (comme les sitemaps) — sous [locale], donc non redirigé par le middleware.
 */

export const revalidate = 3600

const esc = (s = '') =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

type FeedPost = {
  title?: string | null
  slug?: string | null
  publishedAt?: string | null
  meta?: { description?: string | null } | null
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc: 'fr' | 'en' = locale === 'en' ? 'en' : 'fr'
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || process.env.URL || 'https://nrjka.com'

  const payload = await getPayload({ config })

  // Version anglaise désactivable (Paramètres › Langues) : pas de flux EN.
  // Route handler → hors layout, d'où le contrôle local (revalidate 3600 : effet sous 1 h).
  if (loc === 'en') {
    try {
      const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as {
        languages?: { englishEnabled?: boolean | null } | null
      }
      if (settings?.languages?.englishEnabled === false) {
        return new Response('Not found', { status: 404 })
      }
    } catch {
      /* global absent → EN accessible par défaut */
    }
  }

  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    draft: false,
    overrideAccess: false,
    sort: '-publishedAt',
    depth: 0,
    limit: 50,
    pagination: false,
    locale: loc,
    select: { title: true, slug: true, publishedAt: true, meta: true },
  })

  const channelTitle = loc === 'en' ? 'NRJKA — Blog' : 'NRJKA — Le blog'
  const channelDesc =
    loc === 'en' ? 'Latest articles from NRJKA.' : 'Les derniers articles de NRJKA.'
  const selfUrl = `${SITE_URL}/${loc}/rss.xml`
  const blogUrl = `${SITE_URL}/${loc}/posts`

  const items = (docs as FeedPost[])
    .filter((p) => p.slug)
    .map((p) => {
      const link = `${SITE_URL}/${loc}/posts/${p.slug}`
      const pub = p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString()
      return `    <item>
      <title>${esc(p.title || '')}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(p.meta?.description || '')}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(channelTitle)}</title>
    <link>${blogUrl}</link>
    <description>${esc(channelDesc)}</description>
    <language>${loc}</language>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
