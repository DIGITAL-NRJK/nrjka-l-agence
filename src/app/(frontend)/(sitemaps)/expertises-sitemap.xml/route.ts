import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { buildLocalizedSitemap, type LocalizedSitemapEntry } from '@/utilities/sitemap'

const getExpertisesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.URL || 'https://example.com'

    const results = await payload.find({
      collection: 'expertises',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        published: {
          equals: true,
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const entries: LocalizedSitemapEntry[] = results.docs
      ? results.docs
          .filter((doc) => Boolean(doc?.slug))
          .map((doc) => ({
            path: `/expertises/${doc.slug}`,
            lastmod: doc.updatedAt || undefined,
          }))
      : []

    return buildLocalizedSitemap(SITE_URL, entries)
  },
  ['expertises-sitemap'],
  {
    tags: ['expertises-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getExpertisesSitemap()
  return getServerSideSitemap(sitemap)
}
