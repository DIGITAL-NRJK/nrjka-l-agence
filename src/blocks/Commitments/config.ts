import type { Block } from 'payload'

import { appearance } from '@/fields/appearance'

export const Commitments: Block = {
  slug: 'commitments',
  interfaceName: 'CommitmentsBlock',
  labels: {
    singular: 'Engagements',
    plural: 'Engagements',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'commitments',
      type: 'array',
      localized: true,
      maxRows: 10,
      labels: { singular: 'Engagement', plural: 'Engagements' },
      admin: {
        initCollapsed: true,
        description: 'Vos principes / engagements. Affichés en manifeste (mot-clé + énoncé + explication).',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          admin: { description: 'Mot-clé en un mot (ex. RÉSULTAT, HUMAIN, PROPRIÉTÉ).' },
        },
        { name: 'title', type: 'text', admin: { description: 'L’énoncé du principe.' } },
        { name: 'description', type: 'textarea', admin: { description: 'Courte explication.' } },
      ],
    },
    appearance,
  ],
}
