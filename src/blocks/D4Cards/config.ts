import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const D4Cards: Block = {
  slug: 'd4Cards',
  interfaceName: 'D4CardsBlock',
  labels: {
    singular: 'Cartes D4',
    plural: 'Cartes D4',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'cards',
      type: 'array',
      localized: true,
      maxRows: 4,
      labels: { singular: 'Carte', plural: 'Cartes' },
      admin: {
        initCollapsed: true,
        description: 'Les dimensions de la méthode. Numérotées automatiquement (01–04).',
      },
      fields: [
        { name: 'title', type: 'text', admin: { description: 'Ex. Diagnostic.' } },
        { name: 'tagline', type: 'text', admin: { description: 'Courte accroche (une ligne).' } },
      ],
    },
    appearance,
  ],
}
