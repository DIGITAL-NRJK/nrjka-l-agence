// Envoi d'emails transactionnels via Resend (API REST, zéro dépendance).
// Domaine validé côté Cloudflare. Usage serveur uniquement.
//
// Variables d'env :
//   RESEND_API_KEY   clé API Resend
//   RESEND_FROM      expéditeur, ex. « NRJKA <ressources@nrjka.com> » (domaine vérifié)
//   RESEND_REPLY_TO  (optionnel) adresse de réponse, ex. hello@nrjka.com

const API_URL = 'https://api.resend.com/emails'

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM)
}

type SendArgs = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

/**
 * Envoie un email. Renvoie true si accepté par Resend, false sinon.
 * NE JETTE PAS : un échec d'email ne doit jamais bloquer la capture du lead
 * ni la livraison à l'écran.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs): Promise<boolean> {
  if (!resendConfigured()) return false
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: [to],
        subject,
        html,
        ...(text ? { text } : {}),
        ...(replyTo || process.env.RESEND_REPLY_TO
          ? { reply_to: replyTo || process.env.RESEND_REPLY_TO }
          : {}),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
