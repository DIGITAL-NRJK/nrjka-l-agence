import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const AboutHero: Block = {
  slug: 'aboutHero',
  interfaceName: 'AboutHeroBlock',
  labels: {
    singular: 'Hero À propos',
    plural: 'Hero À propos',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: { description: 'Petit libellé (eyebrow) affiché avec un trait au-dessus du titre.' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Titre principal (H1).' },
    },
    {
      name: 'titleAccent',
      type: 'text',
      localized: true,
      admin: { description: 'Segment affiché en terracotta, sur une 2e ligne. Optionnel.' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: { description: 'Chapô sous le titre.' },
    },
    {
      name: 'chips',
      type: 'array',
      localized: true,
      maxRows: 4,
      labels: { singular: 'Chip', plural: 'Chips' },
      admin: {
        initCollapsed: true,
        description: 'Petites cartes de repère (valeur + libellé), ex. « 100% / open source ».',
      },
      fields: [
        { name: 'value', type: 'text', admin: { description: 'La valeur en gros (ex. 100%).' } },
        { name: 'label', type: 'text', admin: { description: 'Le libellé sous la valeur.' } },
      ],
    },
    appearance,
  ],
}
