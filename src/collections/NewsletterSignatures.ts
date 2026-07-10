import type { CollectionConfig } from 'payload'
import { authenticatedRead, adminOnly } from '../access'
import { newsletterEditor } from '@/fields/newsletterEditor'

/**
 * Signatures réutilisables pour les campagnes newsletter.
 * On les crée une fois puis on les rattache à une campagne (champ « Signature »).
 * Contenu riche bilingue (nom + coordonnées + image possible).
 */
export const NewsletterSignatures: CollectionConfig = {
  slug: 'newsletter-signatures',
  labels: { singular: 'Signature', plural: 'Signatures (newsletter)' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    group: 'Marketing',
    description:
      'Blocs de signature réutilisables (nom, fonction, coordonnées, logo…) à rattacher aux campagnes.',
  },
  access: {
    read: authenticatedRead,
    create: authenticatedRead,
    update: authenticatedRead,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom interne',
      admin: { description: 'Non affiché. Sert à choisir la signature dans une campagne.' },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: 'Signature',
      editor: newsletterEditor,
    },
  ],
}
