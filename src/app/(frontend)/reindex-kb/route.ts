import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

import { harvestDoc, chunkText } from '@/utilities/harvestText'
import { embed, aiConfigured } from '@/utilities/mistral'
import { LOCALES } from '@/utilities/i18n'

// Réindexation de la base de connaissances du chatbot (RAG).
// Lit le contenu publié, le découpe, l'embed via Mistral, et reconstruit la
// collection knowledge-chunks. Idempotente (purge + reconstruction).
//
// Accès : ouverte en dev ; en prod, exige ?secret=<REINDEX_SECRET|CRON_SECRET>.
// Options : ?only=posts (une seule collection) · ?locale=fr (une seule langue).
export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Source = {
  collection: string
  path: (slug?: string | null) => string
}

const SOURCES: Source[] = [
  { collection: 'services', path: (s) => `services/${s}` },
  { collection: 'expertises', path: (s) => `expertises/${s}` },
  { collection: 'case-studies', path: (s) => `realisations/${s}` },
  { collection: 'posts', path: (s) => `posts/${s}` },
  { collection: 'pages', path: (s) => (s && s !== 'home' ? `${s}` : '') },
]

const titleOf = (d: Record<string, unknown>): string =>
  (d.title as string) ||
  (d.name as string) ||
  (d.client_name as string) ||
  (d.slug as string) ||
  'Sans titre'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const only = url.searchParams.get('only')
  const localeParam = url.searchParams.get('locale')

  // Garde d'accès en production.
  if (process.env.NODE_ENV === 'production') {
    const secret = process.env.REINDEX_SECRET || process.env.CRON_SECRET
    const provided =
      url.searchParams.get('secret') || req.headers.get('authorization')?.replace('Bearer ', '')
    if (!secret || provided !== secret) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
    }
  }

  if (!aiConfigured()) {
    return NextResponse.json({ error: 'Fournisseur IA non configuré (AI_BASE_URL / clé).' }, { status: 500 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })

  const locales = localeParam && LOCALES.includes(localeParam as never) ? [localeParam] : [...LOCALES]
  const sources = only ? SOURCES.filter((s) => s.collection === only) : SOURCES
  if (sources.length === 0) {
    return NextResponse.json({ error: `Collection inconnue: ${only}` }, { status: 400 })
  }

  try {
    // Purge des fragments existants (ciblée si ?only, sinon totale).
    await payload.delete({
      collection: 'knowledge-chunks',
      where: only ? { sourceCollection: { equals: only } } : { id: { exists: true } },
    })

    type Pending = {
      text: string
      title: string
      url: string
      sourceCollection: string
      sourceId: string
      locale: string
    }
    const pending: Pending[] = []

    for (const locale of locales) {
      for (const src of sources) {
        let docs: Record<string, unknown>[] = []
        try {
          const res = await payload.find({
            collection: src.collection,
            locale,
            depth: 1,
            limit: 1000,
            pagination: false,
          })
          docs = res.docs || []
        } catch {
          continue // collection sans localisation / introuvable : on passe
        }

        for (const doc of docs) {
          if (doc._status && doc._status !== 'published') continue
          const text = harvestDoc(doc)
          if (!text) continue
          const slug = doc.slug as string | undefined
          const rel = src.path(slug)
          const link = rel ? `/${locale}/${rel}` : `/${locale}`
          for (const chunk of chunkText(text)) {
            pending.push({
              text: chunk,
              title: titleOf(doc),
              url: link,
              sourceCollection: src.collection,
              sourceId: String(doc.id),
              locale,
            })
          }
        }
      }
    }

    // Embeddings par lots, puis création des fragments.
    let created = 0
    const BATCH = 32
    for (let i = 0; i < pending.length; i += BATCH) {
      const batch = pending.slice(i, i + BATCH)
      const vectors = await embed(batch.map((p) => p.text))
      for (let j = 0; j < batch.length; j++) {
        const p = batch[j]
        await payload.create({
          collection: 'knowledge-chunks',
          data: {
            title: p.title,
            text: p.text,
            embedding: vectors[j] || [],
            locale: p.locale,
            sourceCollection: p.sourceCollection,
            sourceId: p.sourceId,
            url: p.url,
          },
        })
        created++
      }
    }

    return NextResponse.json({
      ok: true,
      indexed: created,
      locales,
      collections: sources.map((s) => s.collection),
    })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
