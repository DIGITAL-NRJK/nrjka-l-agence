import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

import { TRANSLATABLE_COLLECTIONS, TRANSLATABLE_FIELDS, translateDocument } from '../translate/core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // la traduction d'une collection entière peut être longue

// Traduit TOUS les documents d'une collection (ou de toutes si aucune n'est précisée).
// Le client appelle plutôt une collection à la fois pour afficher la progression.
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  const auth = await payload.auth({ headers: req.headers })
  if (!auth.user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: { collection?: string } = {}
  try {
    body = await req.json()
  } catch {
    /* corps optionnel */
  }

  const slugs = body.collection
    ? [body.collection]
    : TRANSLATABLE_COLLECTIONS.map((c) => c.slug)

  const results: Record<string, { documents: number; translated: number; errors: string[] }> = {}

  for (const slug of slugs) {
    if (!TRANSLATABLE_FIELDS[slug]) {
      results[slug] = { documents: 0, translated: 0, errors: ['collection non configurée'] }
      continue
    }

    const summary = { documents: 0, translated: 0, errors: [] as string[] }
    try {
      const docs = await payload.find({
        collection: slug as Parameters<typeof payload.find>[0]['collection'],
        locale: 'fr',
        depth: 0,
        limit: 1000,
        pagination: false,
        overrideAccess: true,
      })

      summary.documents = docs.docs.length
      for (const doc of docs.docs as { id: string | number }[]) {
        try {
          const keys = await translateDocument(payload, slug, doc.id)
          if (keys.length > 0) summary.translated += 1
        } catch (err) {
          summary.errors.push(`#${doc.id}: ${err instanceof Error ? err.message : 'échec'}`)
        }
      }
    } catch (err) {
      summary.errors.push(err instanceof Error ? err.message : 'échec de lecture')
    }
    results[slug] = summary
  }

  // Revalidation large : les contenus traduits touchent beaucoup de pages.
  try {
    revalidateTag('global_header', 'max')
    revalidateTag('global_footer', 'max')
    revalidatePath('/', 'layout')
  } catch {
    /* best-effort */
  }

  const totalTranslated = Object.values(results).reduce((n, r) => n + r.translated, 0)
  return NextResponse.json({
    message: `${totalTranslated} document(s) traduit(s).`,
    results,
  })
}
