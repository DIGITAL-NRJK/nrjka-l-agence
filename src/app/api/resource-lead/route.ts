import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

import { sendEmail } from '@/utilities/resend'
import { getServerSideURL } from '@/utilities/getURL'

// Capture de lead pour une ressource « gated » (email requis).
// Stocke le lead (contact-messages, source_tool=resource), incrémente le compteur
// de téléchargements, envoie la ressource par email (Resend) et renvoie l'URL de
// téléchargement pour un accès immédiat à l'écran.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

const emailTemplate = (locale: string, opts: { name: string; title: string; url: string }) => {
  const en = locale === 'en'
  const subject = en ? `Your NRJKA resource: ${opts.title}` : `Votre ressource NRJKA : ${opts.title}`
  const hello = en ? `Hi ${opts.name},` : `Bonjour ${opts.name},`
  const intro = en
    ? `Thanks for your interest. Here is the resource you requested:`
    : `Merci de votre intérêt. Voici la ressource que vous avez demandée :`
  const cta = en ? 'Download the resource' : 'Télécharger la ressource'
  const outro = en
    ? `If the button doesn't work, copy this link into your browser:`
    : `Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :`
  const sign = en ? 'The NRJKA team' : 'L’équipe NRJKA'
  const html = `<!doctype html><html><body style="margin:0;background:#f5f4f1;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1a1f2e">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e3dd">
      <tr><td style="background:#1f2a44;padding:20px 28px;color:#ffffff;font-weight:bold;font-size:18px">NRJKA</td></tr>
      <tr><td style="padding:28px">
        <p style="margin:0 0 14px">${hello}</p>
        <p style="margin:0 0 18px;line-height:1.6">${intro}<br><strong>${opts.title}</strong></p>
        <p style="margin:0 0 24px">
          <a href="${opts.url}" style="display:inline-block;background:#c9583b;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold">${cta}</a>
        </p>
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280">${outro}</p>
        <p style="margin:0 0 24px;font-size:13px;word-break:break-all"><a href="${opts.url}" style="color:#c9583b">${opts.url}</a></p>
        <p style="margin:0;color:#6b7280">${sign}</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`
  const text = `${hello}\n\n${intro} ${opts.title}\n${opts.url}\n\n${sign}`
  return { subject, html, text }
}

export async function POST(req: Request) {
  let body: {
    name?: string
    email?: string
    consent?: boolean
    resourceId?: string
    locale?: string
    website?: string // honeypot
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  // Honeypot : un bot a rempli le champ caché → on simule un succès et on ignore.
  if (body.website) return NextResponse.json({ ok: true, downloadUrl: null, emailed: false })

  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const locale = body.locale === 'en' ? 'en' : 'fr'

  if (!name || !emailValid(email) || body.consent !== true || !body.resourceId) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })

  // Charge la ressource (id numérique nettoyé du préfixe éventuel « r- »).
  const rid = String(body.resourceId).replace(/^r-/, '')
  let resource: Record<string, unknown> | null = null
  try {
    resource = await payload.findByID({ collection: 'resources', id: rid, depth: 1 })
  } catch {
    resource = null
  }
  if (!resource || resource.published !== true) {
    return NextResponse.json({ error: 'Ressource introuvable.' }, { status: 404 })
  }

  const title = (resource.title as string) || 'Ressource'
  const slug = (resource.slug as string) || rid
  const downloadUrl = (resource.file_url as string) || mediaUrl(resource.file)

  // Enregistre le lead (n'échoue jamais silencieusement côté utilisateur).
  try {
    await payload.create({
      collection: 'contact-messages',
      data: {
        name,
        email,
        message: `Demande de ressource : ${title} (${slug})`,
        type: 'general',
        source_tool: 'resource',
        service_type: title,
        context: `Ressource : ${slug}`,
        status: 'new',
      },
    })
    // Incrémente le compteur de téléchargements (best-effort).
    const current = typeof resource.downloads === 'number' ? resource.downloads : 0
    await payload.update({
      collection: 'resources',
      id: rid,
      data: { downloads: current + 1 },
    })
  } catch {
    // On continue : la livraison prime sur l'enregistrement.
  }

  // Envoie la ressource par email (best-effort). Absolutise l'URL si relative.
  let emailed = false
  if (downloadUrl) {
    const absUrl = /^https?:\/\//.test(downloadUrl)
      ? downloadUrl
      : `${getServerSideURL()}${downloadUrl}`
    const { subject, html, text } = emailTemplate(locale, { name, title, url: absUrl })
    emailed = await sendEmail({ to: email, subject, html, text })
  }

  return NextResponse.json({ ok: true, downloadUrl, emailed })
}
