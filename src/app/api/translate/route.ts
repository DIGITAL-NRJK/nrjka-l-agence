import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

import { TRANSLATABLE_FIELDS, translateDocument } from './core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Rafraîchit les vues en cache après écriture des traductions.
function revalidateAfter(collection: string, slug?: unknown) {
  try {
    revalidateTag('global_header')
    revalidateTag('global_footer')
    const segment =
      collection === 'services'
        ? 'services'
        : collection === 'expertises'
          ? 'expertises'
          : collection === 'posts'
            ? 'posts'
            : collection === 'case-studies'
              ? 'realisations'
              : null
    if (segment && typeof slug === 'string' && slug) {
      revalidatePath(`/fr/${segment}/${slug}`)
      revalidatePath(`/en/${segment}/${slug}`)
    }
  } catch {
    /* best-effort */
  }
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  const auth = await payload.auth({ headers: req.headers })
  if (!auth.user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: { collection?: string; id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { collection, id } = body
  if (!collection || !id) {
    return NextResponse.json({ error: 'Missing collection or id.' }, { status: 400 })
  }
  if (!TRANSLATABLE_FIELDS[collection]) {
    return NextResponse.json(
      { error: `Collection "${collection}" not configured for translation.` },
      { status: 400 },
    )
  }

  let translatedKeys: string[]
  try {
    translatedKeys = await translateDocument(payload, collection, id)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Translation failed.' },
      { status: 500 },
    )
  }

  if (translatedKeys.length === 0) {
    return NextResponse.json(
      { message: 'Aucun champ de texte à traduire trouvé dans ce document.' },
      { status: 200 },
    )
  }

  // Récupère le slug pour la revalidation ciblée.
  try {
    const doc = await payload.findByID({
      collection: collection as Parameters<typeof payload.findByID>[0]['collection'],
      id,
      depth: 0,
    })
    revalidateAfter(collection, (doc as { slug?: unknown })?.slug)
  } catch {
    revalidateAfter(collection)
  }

  return NextResponse.json({
    message: `${translatedKeys.length} champ(s) traduit(s) et sauvegardé(s) en anglais.`,
    translated: translatedKeys,
  })
}
