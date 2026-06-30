import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import {
  buildLocalizedSitemap,
  localizedPathsFromDoc,
  type LocalizedSitemapEntry,
} from '@/utilities/sitemap'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.URL || 'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: 'all',
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Index du blog (la page de recherche reste hors sitemap : pas d'intérêt à indexer des résultats).
    const staticEntries: LocalizedSitemapEntry[] = [{ path: '/posts' }]

    const pageEntries: LocalizedSitemapEntry[] = results.docs
      ? results.docs
          .map((page) => ({
            paths: localizedPathsFromDoc(page, (s) => (s === 'home' ? '' : `/${s}`)),
            lastmod: page.updatedAt || undefined,
          }))
          .filter((e) => Object.keys(e.paths).length > 0)
      : []

    return buildLocalizedSitemap(SITE_URL, [...staticEntries, ...pageEntries])
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
