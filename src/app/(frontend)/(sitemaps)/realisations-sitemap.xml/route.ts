import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

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
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    return results.docs
      ? results.docs
          .filter((doc) => Boolean(doc?.slug))
          .map((doc) => ({
            loc: `${SITE_URL}/realisations/${doc.slug}`,
            lastmod: doc.updatedAt || dateFallback,
          }))
      : []
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
