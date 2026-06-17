import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'Petit libellé au-dessus du titre (ex. « Questions fréquentes »).' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Titre de la section.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: { description: 'Texte d’introduction (optionnel).' },
    },
    {
      name: 'items',
      type: 'array',
      localized: true,
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { description: 'Les questions / réponses, affichées en accordéon dépliable.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    appearance,
  ],
}
