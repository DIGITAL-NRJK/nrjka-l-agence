import type { CollectionConfig } from 'payload'
import { authenticatedRead, adminOnly } from '../access'
import { newsletterToken } from '@/utilities/newsletter'

/**
 * Abonnés à la newsletter. Création publique passe par /api/newsletter/subscribe
 * (local API, overrideAccess) — pas d'accès create public en REST.
 * Double opt-in : status « pending » tant que le lien de confirmation n'est pas cliqué.
 */
export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Abonné', plural: 'Abonnés (newsletter)' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'locale', 'source', 'createdAt'],
    group: 'Marketing',
    description:
      'Liste des abonnés à la newsletter. « En attente » = inscription non confirmée (double opt-in). Export CSV : /api/newsletter/export (admin connecté).',
  },
  access: {
    read: authenticatedRead,
    create: authenticatedRead,
    update: authenticatedRead,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.confirmToken) data.confirmToken = newsletterToken()
          if (!data.unsubscribeToken) data.unsubscribeToken = newsletterToken()
          if (!data.consentAt) data.consentAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email',
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'Prénom',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      label: 'Statut',
      admin: { position: 'sidebar' },
      options: [
        { label: '⏳ En attente (non confirmé)', value: 'pending' },
        { label: '✅ Confirmé', value: 'confirmed' },
        { label: '🚫 Désabonné', value: 'unsubscribed' },
      ],
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'fr',
      label: 'Langue',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      label: 'Source',
      admin: {
        position: 'sidebar',
        description: 'Origine de l’inscription (footer, popup, import, admin…).',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: { description: 'Segmentation optionnelle (utilisable comme audience de campagne).' },
      fields: [{ name: 'tag', type: 'text' }],
    },
    // ─── Suivi (lecture seule) ────────────────────────────────────────────────
    {
      name: 'consentAt',
      type: 'date',
      label: 'Consentement le',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'confirmedAt',
      type: 'date',
      label: 'Confirmé le',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      label: 'Désabonné le',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    // ─── Tokens (cachés) ──────────────────────────────────────────────────────
    { name: 'confirmToken', type: 'text', admin: { hidden: true } },
    { name: 'unsubscribeToken', type: 'text', admin: { hidden: true } },
  ],
}
