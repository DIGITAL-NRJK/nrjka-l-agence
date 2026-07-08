import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

// Réception d'une candidature (multipart). Le CV est téléversé côté serveur via
// l'API locale (overrideAccess) car la création de média est réservée aux
// contributeurs — un visiteur public ne peut pas le faire directement.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const MAX_CV_BYTES = 5 * 1024 * 1024 // 5 Mo

export async function POST(req: Request) {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  // Honeypot : bot → succès simulé, ignoré.
  if (form.get('company')) return NextResponse.json({ ok: true })

  const firstName = String(form.get('first_name') || '').trim()
  const lastName = String(form.get('last_name') || '').trim()
  const email = String(form.get('email') || '').trim()
  const jobOfferId = String(form.get('job_offer') || '').trim()

  if (!firstName || !lastName || !emailValid(email) || form.get('consent') !== 'on') {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })

  // CV (optionnel) → média, best-effort (ne bloque jamais la candidature).
  let resumeId: number | string | null = null
  const cv = form.get('cv')
  if (cv && typeof cv === 'object' && 'arrayBuffer' in cv && (cv as File).size > 0) {
    const file = cv as File
    if (file.size <= MAX_CV_BYTES) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const media = await payload.create({
          collection: 'media',
          data: { alt: `CV — ${firstName} ${lastName}` },
          file: {
            data: buffer,
            mimetype: file.type || 'application/octet-stream',
            name: file.name || `cv-${Date.now()}`,
            size: file.size,
          },
        })
        resumeId = media?.id ?? null
      } catch {
        resumeId = null
      }
    }
  }

  try {
    await payload.create({
      collection: 'job-applications',
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: String(form.get('phone') || '') || undefined,
        linkedin_url: String(form.get('linkedin_url') || '') || undefined,
        portfolio_url: String(form.get('portfolio_url') || '') || undefined,
        cover_letter: String(form.get('cover_letter') || '') || undefined,
        ...(resumeId ? { resume: resumeId } : {}),
        ...(jobOfferId ? { job_offer: Number(jobOfferId) || jobOfferId } : {}),
        status: 'new',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
