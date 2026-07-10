import type { CollectionConfig } from 'payload'
import { authenticatedRead, adminOnly } from '../access'
import { sendCampaign, campaignEmail, lexicalToEmailHtml, audienceWhere } from '@/utilities/newsletter'
import { sendEmail } from '@/utilities/resend'
import { newsletterEditor } from '@/fields/newsletterEditor'

/**
 * Campagnes newsletter. Contenu bilingue (FR/EN).
 * Envoi piloté par cases à cocher dans la barre latérale :
 *  - « Envoyer un test » + email de test → un seul email de contrôle.
 *  - « Envoyer la campagne » → envoi à toute l'audience (abonnés confirmés).
 * Le hook afterChange déclenche l'envoi puis remet la case à zéro (garde anti-boucle).
 */
export const NewsletterCampaigns: CollectionConfig = {
  slug: 'newsletter-campaigns',
  labels: { singular: 'Campagne', plural: 'Campagnes (newsletter)' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'audience', 'sentAt', 'recipientCount'],
    group: 'Marketing',
    description:
      'Rédigez, testez et envoyez une campagne aux abonnés confirmés. Pensez à remplir les versions FR et EN (bascule de langue en haut à droite).',
  },
  access: {
    read: authenticatedRead,
    create: authenticatedRead,
    update: authenticatedRead,
    delete: adminOnly,
  },
  hooks: {
    // On prépare l'envoi ICI (reset des cases + statut) pour éviter tout ré-écriture
    // du même document dans son propre afterChange (source de deadlock de transaction).
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const ctx = req.context as Record<string, unknown>

        // Envoi de test (exécuté en afterChange).
        if (data.sendTest && data.testEmail) {
          ctx.newsletterTest = { email: data.testEmail as string, locale: req.locale }
          data.sendTest = false
        }

        // Envoi réel : uniquement depuis un brouillon (empêche un renvoi accidentel).
        const wasDraft = ((originalDoc?.status as string) ?? 'draft') === 'draft'
        if (data.sendNow && wasDraft) {
          const where = audienceWhere(
            (data.audience as string) ?? (originalDoc?.audience as string) ?? 'all_confirmed',
            (data.tag as string) ?? (originalDoc?.tag as string) ?? undefined,
          )
          let total = 0
          try {
            const c = await req.payload.count({
              collection: 'newsletter-subscribers',
              where,
              overrideAccess: true,
            })
            total = c?.totalDocs ?? 0
          } catch {
            total = 0
          }
          ctx.newsletterSend = true
          data.sendNow = false
          data.status = 'sent'
          data.sentAt = new Date().toISOString()
          data.recipientCount = total
        }
        return data
      },
    ],
    // Exécution des envois APRÈS persistance — aucune écriture supplémentaire ici.
    afterChange: [
      async ({ doc, req }) => {
        const ctx = req.context as Record<string, unknown>

        if (ctx.newsletterTest) {
          const t = ctx.newsletterTest as { email: string; locale?: string }
          const loc = t.locale === 'en' ? 'en' : 'fr'
          const bodyHtml = await lexicalToEmailHtml(req.payload, doc.body)
          let signatureHtml = ''
          if (doc.signature) {
            const sigId =
              typeof doc.signature === 'object' ? doc.signature.id : doc.signature
            try {
              const sig = await req.payload.findByID({
                collection: 'newsletter-signatures',
                id: sigId,
                locale: loc,
                depth: 1,
                overrideAccess: true,
              })
              signatureHtml = await lexicalToEmailHtml(req.payload, sig?.content)
            } catch {
              /* signature introuvable : on ignore */
            }
          }
          const tpl = campaignEmail(loc, {
            subject: `[TEST] ${doc.subject || 'NRJKA'}`,
            preheader: doc.preheader || undefined,
            bodyHtml,
            signatureHtml,
            unsubToken: 'apercu',
          })
          await sendEmail({ to: t.email, subject: tpl.subject, html: tpl.html, text: tpl.text })
          ctx.newsletterTest = undefined
        }

        if (ctx.newsletterSend) {
          ctx.newsletterSend = false
          await sendCampaign(req.payload, doc.id)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom interne',
      admin: { description: 'Non envoyé. Sert à identifier la campagne.' },
    },
    {
      name: 'subject',
      type: 'text',
      localized: true,
      label: 'Objet de l’email',
    },
    {
      name: 'preheader',
      type: 'text',
      localized: true,
      label: 'Pré-en-tête',
      admin: { description: 'Court texte d’aperçu affiché après l’objet dans la boîte mail.' },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: 'Contenu',
      editor: newsletterEditor,
      admin: {
        description:
          'Titres, gras, listes, liens et images. Un pied de page avec lien de désabonnement est ajouté automatiquement à l’envoi.',
      },
    },
    {
      name: 'signature',
      type: 'relationship',
      relationTo: 'newsletter-signatures',
      label: 'Signature',
      admin: {
        description: 'Bloc de signature ajouté en bas de l’email (optionnel, réutilisable).',
      },
    },
    {
      name: 'audience',
      type: 'select',
      defaultValue: 'all_confirmed',
      label: 'Audience',
      options: [
        { label: 'Tous les abonnés confirmés', value: 'all_confirmed' },
        { label: 'Confirmés — Français', value: 'fr_confirmed' },
        { label: 'Confirmés — English', value: 'en_confirmed' },
        { label: 'Confirmés avec un tag', value: 'tag' },
      ],
    },
    {
      name: 'tag',
      type: 'text',
      label: 'Tag ciblé',
      admin: {
        condition: (_, sibling) => sibling?.audience === 'tag',
        description: 'N’envoyer qu’aux abonnés portant ce tag.',
      },
    },
    // ─── Envoi (barre latérale) ───────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Statut',
      admin: { position: 'sidebar' },
      options: [
        { label: '📝 Brouillon', value: 'draft' },
        { label: '📤 Envoyée', value: 'sent' },
      ],
    },
    {
      name: 'testEmail',
      type: 'email',
      label: 'Email de test',
      admin: { position: 'sidebar' },
    },
    {
      name: 'sendTest',
      type: 'checkbox',
      defaultValue: false,
      label: 'Envoyer un test',
      admin: {
        position: 'sidebar',
        description: 'Coche + Enregistre → un email de contrôle est envoyé à l’email de test.',
      },
    },
    {
      name: 'sendNow',
      type: 'checkbox',
      defaultValue: false,
      label: '🚀 Envoyer la campagne',
      admin: {
        position: 'sidebar',
        description:
          'Coche + Enregistre → envoi immédiat à toute l’audience. Action définitive (le statut passe à « Envoyée »).',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Envoyée le',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'recipientCount',
      type: 'number',
      label: 'Destinataires',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
