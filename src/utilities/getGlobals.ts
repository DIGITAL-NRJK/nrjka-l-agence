import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, locale = 'fr') {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale: locale as 'fr' | 'en',
  })

  return global
}

export const getCachedGlobal = (slug: Global, depth = 0, locale = 'fr') =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, String(depth), locale], {
    tags: [`global_${slug}`, `global_${slug}_${locale}`],
    // Le méga-menu intègre des titres de services (relations) : une modification d'un
    // service doit se propager. Le tag est revalidé par /api/translate ; ce délai sert
    // de filet de sécurité pour les modifications manuelles dans l'admin.
    revalidate: 60,
  })
