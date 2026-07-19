import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import {
  activeSitemapLocales,
  buildLocalizedSitemap,
  localizedPathsFromDoc,
  type LocalizedSitemapEntry,
} from '@/utilities/sitemap'

const getRealisationsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.URL || 'https://example.com'

    const results = await payload.find({
      collection: 'case-studies',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: 'all',
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const entries: LocalizedSitemapEntry[] = results.docs
      ? results.docs
          .map((doc) => ({
            paths: localizedPathsFromDoc(doc, (s) => `/realisations/${s}`),
            lastmod: doc.updatedAt || undefined,
          }))
          .filter((e) => Object.keys(e.paths).length > 0)
      : []

    return buildLocalizedSitemap(SITE_URL, entries, await activeSitemapLocales(payload))
  },
  ['realisations-sitemap'],
  {
    tags: ['realisations-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getRealisationsSitemap()
  return getServerSideSitemap(sitemap)
}
