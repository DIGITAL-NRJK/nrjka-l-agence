import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getServicesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.URL || 'https://example.com'

    const results = await payload.find({
      collection: 'services',
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

    const dateFallback = new Date().toISOString()

    return results.docs
      ? results.docs
          .filter((doc) => Boolean(doc?.slug))
          .map((doc) => ({
            loc: `${SITE_URL}/services/${doc.slug}`,
            lastmod: doc.updatedAt || dateFallback,
          }))
      : []
  },
  ['services-sitemap'],
  {
    tags: ['services-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getServicesSitemap()
  return getServerSideSitemap(sitemap)
}
