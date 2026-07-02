import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { seedEnSlugs } from '@/scripts/seed-en-slugs'

// Tâche #13 — Slugs EN traduits (non destructif).
// Utilisable en prod : réservé à un utilisateur connecté à l'admin.
// GET /next/seed-en-slugs          → DRY-RUN (rapport, aucune écriture)
// GET /next/seed-en-slugs?apply=1  → applique les changements (locale EN uniquement)
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request): Promise<Response> {
  const payload = await getPayload({ config })

  // Authentification via le cookie admin (il suffit d'être connecté à /admin).
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) {
    return new Response('Action interdite : connectez-vous à /admin d’abord.', { status: 403 })
  }

  const apply = new URL(request.url).searchParams.get('apply') === '1'

  try {
    const result = await seedEnSlugs(payload, { dryRun: !apply })
    // Les écritures SQL directes contournent les hooks de revalidation → on rafraîchit large.
    if (apply) {
      try {
        revalidatePath('/', 'layout')
      } catch {
        /* best-effort */
      }
    }
    return NextResponse.json({
      ok: true,
      mode: apply ? 'APPLIQUÉ' : 'DRY-RUN (aucune écriture — ajoutez ?apply=1 pour appliquer)',
      ...result,
    })
  } catch (err) {
    payload.logger.error({ err, message: 'Erreur seed-en-slugs' })
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
