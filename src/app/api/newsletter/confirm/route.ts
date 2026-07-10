import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Confirmation d'inscription (double opt-in) : GET /api/newsletter/confirm?token=…
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const page = (locale: string, ok: boolean) => {
  const en = locale === 'en'
  const title = ok
    ? en
      ? 'Subscription confirmed 🎉'
      : 'Inscription confirmée 🎉'
    : en
      ? 'Invalid or expired link'
      : 'Lien invalide ou expiré'
  const msg = ok
    ? en
      ? 'Thank you! You will now receive the NRJKA newsletter.'
      : 'Merci ! Vous recevrez désormais la newsletter NRJKA.'
    : en
      ? 'This confirmation link is no longer valid.'
      : 'Ce lien de confirmation n’est plus valide.'
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
  <body style="margin:0;background:#f5f4f1;font-family:Arial,Helvetica,sans-serif;color:#1a1f2e;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
    <div style="background:#fff;border:1px solid #e6e3dd;border-radius:16px;max-width:440px;padding:36px;text-align:center">
      <div style="color:#1f2a44;font-weight:bold;font-size:20px;margin-bottom:16px">NRJKA</div>
      <h1 style="font-size:20px;margin:0 0 10px">${title}</h1>
      <p style="margin:0;color:#4b5563;line-height:1.6">${msg}</p>
      <p style="margin:24px 0 0"><a href="/" style="color:#c9583b;text-decoration:none;font-weight:bold">${en ? 'Back to site' : 'Retour au site'}</a></p>
    </div>
  </body></html>`
}

const html = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') || ''
  if (!token) return html(page('fr', false), 400)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })
  try {
    const res = await payload.find({
      collection: 'newsletter-subscribers',
      where: { confirmToken: { equals: token } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const sub = res?.docs?.[0]
    if (!sub) return html(page('fr', false), 404)

    const locale = sub.locale === 'en' ? 'en' : 'fr'
    if (sub.status !== 'confirmed') {
      await payload.update({
        collection: 'newsletter-subscribers',
        id: sub.id,
        data: { status: 'confirmed', confirmedAt: new Date().toISOString() },
        overrideAccess: true,
      })
    }
    return html(page(locale, true))
  } catch {
    return html(page('fr', false), 500)
  }
}
