// Newsletter : tokens, URLs, templates email, conversion richText→HTML et envoi de campagnes.
// Usage serveur uniquement. Réutilise le client Resend (src/utilities/resend.ts).
import type { Where } from 'payload'
import { randomUUID } from 'crypto'
import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'

import { getServerSideURL } from '@/utilities/getURL'
import { sendBatch } from '@/utilities/resend'

export const newsletterToken = (): string => `${randomUUID()}${randomUUID()}`.replace(/-/g, '')

export const confirmUrl = (token: string) =>
  `${getServerSideURL()}/api/newsletter/confirm?token=${token}`
export const unsubscribeUrl = (token: string) =>
  `${getServerSideURL()}/api/newsletter/unsubscribe?token=${token}`

const SLOGAN: Record<'fr' | 'en', string> = {
  fr: 'Votre partenaire digital et stratégique pour construire une croissance durable.',
  en: 'Your strategic digital partner to build sustainable growth.',
}

const abs = (url: string) => (/^https?:\/\//.test(url) ? url : `${getServerSideURL()}${url}`)

// ─── Enveloppe HTML brandée (bannière NRJKA + slogan) ────────────────────────
const shell = (innerHtml: string, locale: string) => {
  const slogan = SLOGAN[locale === 'en' ? 'en' : 'fr']
  return `<!doctype html><html><body style="margin:0;background:#f5f4f1;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1a1f2e">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e3dd">
      <tr><td style="background:#1f2a44;padding:22px 28px;color:#ffffff">
        <div style="font-weight:bold;font-size:20px;letter-spacing:.5px">NRJKA</div>
        <div style="font-size:12px;color:#ffffff;opacity:.72;margin-top:4px;line-height:1.4">${slogan}</div>
      </td></tr>
      <tr><td style="padding:28px;line-height:1.6">${innerHtml}</td></tr>
    </table>
  </td></tr></table></body></html>`
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#c9583b;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold">${label}</a>`

const stripHtml = (s: string): string => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

// ─── Conversion richText (lexical) → HTML email ──────────────────────────────
// Images résolues en URL absolue + max-width 100 % (compatible clients mail).
export async function lexicalToEmailHtml(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  data: unknown,
): Promise<string> {
  if (!data || typeof data !== 'object') return ''
  try {
    return await convertLexicalToHTMLAsync({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      disableContainer: true,
      populate: async ({ id, collectionSlug }) => {
        try {
          return await payload.findByID({
            collection: collectionSlug,
            id,
            depth: 0,
            overrideAccess: true,
          })
        } catch {
          return undefined
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      converters: ({ defaultConverters }: any) => ({
        ...defaultConverters,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        upload: async ({ node, populate }: any) => {
          const v = node?.value
          let doc = v && typeof v === 'object' ? v : null
          if (!doc && populate && v != null) {
            doc = await populate({ id: v, collectionSlug: node.relationTo })
          }
          const url = doc?.url
          if (!url) return ''
          const src = abs(String(url))
          const isImg = typeof doc?.mimeType === 'string' && doc.mimeType.startsWith('image')
          if (!isImg) {
            return `<a href="${src}" style="color:#c9583b">${doc?.filename || 'fichier'}</a>`
          }
          const alt = String(node?.fields?.alt || doc?.alt || '').replace(/"/g, '&quot;')
          return `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;display:block;margin:14px 0" />`
        },
      }),
    })
  } catch {
    return ''
  }
}

// ─── Email de confirmation (double opt-in) ───────────────────────────────────
export function confirmEmail(
  locale: string,
  opts: { firstName?: string; token: string },
): { subject: string; html: string; text: string } {
  const en = locale === 'en'
  const url = confirmUrl(opts.token)
  const hello = opts.firstName
    ? en
      ? `Hi ${opts.firstName},`
      : `Bonjour ${opts.firstName},`
    : en
      ? 'Hello,'
      : 'Bonjour,'
  const subject = en ? 'Confirm your subscription' : 'Confirmez votre inscription'
  const intro = en
    ? 'Please confirm you want to receive the NRJKA newsletter by clicking the button below:'
    : 'Merci de confirmer votre inscription à la newsletter NRJKA en cliquant sur le bouton ci-dessous :'
  const cta = en ? 'Confirm my subscription' : 'Confirmer mon inscription'
  const outro = en
    ? "If you didn't request this, you can ignore this email."
    : "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email."
  const html = shell(
    `<p style="margin:0 0 14px">${hello}</p>
     <p style="margin:0 0 22px">${intro}</p>
     <p style="margin:0 0 24px">${btn(url, cta)}</p>
     <p style="margin:0;font-size:13px;color:#6b7280">${outro}</p>`,
    locale,
  )
  const text = `${hello}\n\n${intro}\n${url}\n\n${outro}`
  return { subject, html, text }
}

// ─── Email de campagne (corps + signature + pied de désabonnement) ───────────
export function campaignEmail(
  locale: string,
  opts: {
    subject: string
    bodyHtml: string
    unsubToken: string
    preheader?: string
    signatureHtml?: string
  },
): { subject: string; html: string; text: string } {
  const en = locale === 'en'
  const url = unsubscribeUrl(opts.unsubToken)
  const unsub = en ? 'Unsubscribe' : 'Se désabonner'
  const footer = en
    ? 'You receive this email because you subscribed to the NRJKA newsletter.'
    : 'Vous recevez cet email car vous êtes inscrit à la newsletter NRJKA.'
  const pre = opts.preheader
    ? `<span style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</span>`
    : ''
  const signature = opts.signatureHtml
    ? `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e6e3dd;color:#4b5563">${opts.signatureHtml}</div>`
    : ''
  const html = shell(
    `${pre}<div>${opts.bodyHtml}</div>
     ${signature}
     <hr style="border:none;border-top:1px solid #e6e3dd;margin:28px 0 16px" />
     <p style="margin:0;font-size:12px;color:#6b7280">${footer}<br>
       <a href="${url}" style="color:#6b7280;text-decoration:underline">${unsub}</a>
     </p>`,
    locale,
  )
  const text = `${opts.preheader ? opts.preheader + '\n\n' : ''}${stripHtml(opts.bodyHtml)}${
    opts.signatureHtml ? '\n\n' + stripHtml(opts.signatureHtml) : ''
  }\n\n${footer}\n${unsub}: ${url}`
  return { subject: opts.subject, html, text }
}

// ─── Audience → clause where Payload ─────────────────────────────────────────
export function audienceWhere(audience: string, tag?: string): Where {
  const base: Where = { status: { equals: 'confirmed' } }
  if (audience === 'fr_confirmed') return { ...base, locale: { equals: 'fr' } }
  if (audience === 'en_confirmed') return { ...base, locale: { equals: 'en' } }
  if (audience === 'tag' && tag) return { ...base, 'tags.tag': { equals: tag } }
  return base // all_confirmed
}

// ─── Envoi d'une campagne à son audience ─────────────────────────────────────
type SubscriberLike = {
  email: string
  locale?: string | null
  unsubscribeToken?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signatureHtmlFor = async (payload: any, signature: unknown): Promise<string> => {
  if (!signature || typeof signature !== 'object') return ''
  const content = (signature as { content?: unknown }).content
  return content ? lexicalToEmailHtml(payload, content) : ''
}

/**
 * Envoie la campagne (contenu bilingue riche) aux abonnés confirmés de l'audience.
 * Chaque abonné reçoit la version de sa langue (repli FR si l'anglais est vide).
 * Renvoie le nombre d'emails acceptés par Resend.
 */
export async function sendCampaign(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  campaignId: string | number,
): Promise<number> {
  const [fr, en] = await Promise.all([
    payload.findByID({
      collection: 'newsletter-campaigns',
      id: campaignId,
      locale: 'fr',
      depth: 2,
      overrideAccess: true,
    }),
    payload.findByID({
      collection: 'newsletter-campaigns',
      id: campaignId,
      locale: 'en',
      depth: 2,
      overrideAccess: true,
    }),
  ])
  if (!fr) return 0

  // Conversion richText → HTML une seule fois par langue.
  const frBody = await lexicalToEmailHtml(payload, fr.body)
  const enBody = en ? await lexicalToEmailHtml(payload, en.body) : ''
  const frSig = await signatureHtmlFor(payload, fr.signature)
  const enSig = en ? await signatureHtmlFor(payload, en.signature) : ''

  const where = audienceWhere((fr.audience as string) || 'all_confirmed', fr.tag || undefined)
  const res = await payload.find({
    collection: 'newsletter-subscribers',
    where,
    limit: 5000,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  const subs = (res?.docs || []) as SubscriberLike[]

  const messages = subs
    .filter((s) => s.email && s.unsubscribeToken)
    .map((s) => {
      const isEn = s.locale === 'en'
      const c = (isEn ? en : fr) || fr
      const tpl = campaignEmail(isEn ? 'en' : 'fr', {
        subject: c.subject || fr.subject || 'NRJKA',
        preheader: c.preheader || undefined,
        bodyHtml: (isEn ? enBody : frBody) || frBody,
        signatureHtml: (isEn ? enSig : frSig) || frSig,
        unsubToken: s.unsubscribeToken as string,
      })
      return { to: s.email, subject: tpl.subject, html: tpl.html, text: tpl.text }
    })
  return sendBatch(messages)
}
