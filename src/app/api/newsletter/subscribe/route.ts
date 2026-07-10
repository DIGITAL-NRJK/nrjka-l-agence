import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

import { confirmEmail, newsletterToken } from '@/utilities/newsletter'
import { sendEmail } from '@/utilities/resend'

// Inscription à la newsletter avec double opt-in.
// Crée (ou réactive) un abonné en statut « pending » et envoie l'email de confirmation.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

export async function POST(req: Request) {
  let body: {
    email?: string
    firstName?: string
    locale?: string
    source?: string
    website?: string // honeypot
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  // Honeypot : bot → succès simulé, rien n'est enregistré.
  if (body.website) return NextResponse.json({ ok: true })

  const email = (body.email || '').trim().toLowerCase()
  const firstName = (body.firstName || '').trim() || undefined
  const locale = body.locale === 'en' ? 'en' : 'fr'
  const source = (body.source || 'site').trim()

  if (!emailValid(email)) {
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })

  try {
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const sub = existing?.docs?.[0]

    // Déjà confirmé : rien à faire (on ne divulgue pas l'état, réponse neutre).
    if (sub && sub.status === 'confirmed') {
      return NextResponse.json({ ok: true, alreadyConfirmed: true })
    }

    let token: string
    if (sub) {
      // En attente ou désabonné → on repasse en attente et on renvoie la confirmation.
      token = sub.confirmToken || newsletterToken()
      await payload.update({
        collection: 'newsletter-subscribers',
        id: sub.id,
        data: {
          status: 'pending',
          firstName: firstName ?? sub.firstName,
          locale,
          source,
          confirmToken: token,
          consentAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
    } else {
      const created = await payload.create({
        collection: 'newsletter-subscribers',
        data: { email, firstName, locale, source, status: 'pending' },
        overrideAccess: true,
      })
      token = created.confirmToken
    }

    // Email de confirmation (best-effort : ne bloque jamais la réponse).
    const { subject, html, text } = confirmEmail(locale, { firstName, token })
    await sendEmail({ to: email, subject, html, text })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 })
  }
}
