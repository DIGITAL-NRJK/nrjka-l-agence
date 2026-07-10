import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Export CSV des abonnés — réservé aux utilisateurs connectés à l'admin.
// GET /api/newsletter/export
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const cell = (v: unknown): string => {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export async function GET(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })

  // Vérifie que la requête vient d'un utilisateur connecté (cookie admin).
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Unauthorized', { status: 401 })

  const res = await payload.find({
    collection: 'newsletter-subscribers',
    limit: 100000,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  const header = ['email', 'firstName', 'status', 'locale', 'source', 'consentAt', 'confirmedAt']
  const rows = (res?.docs || []).map((s: Record<string, unknown>) =>
    [s.email, s.firstName, s.status, s.locale, s.source, s.consentAt, s.confirmedAt]
      .map(cell)
      .join(','),
  )
  const csv = [header.join(','), ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="newsletter-subscribers.csv"',
    },
  })
}
