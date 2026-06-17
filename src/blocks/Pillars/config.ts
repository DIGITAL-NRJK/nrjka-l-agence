import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Pillars: Block = {
  slug: 'pillars',
  interfaceName: 'PillarsBlock',
  labels: {
    singular: 'Piliers (Expertises)',
    plural: 'Piliers (Expertises)',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'Petit libellé au-dessus du titre (ex. « Nos expertises »).' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Titre de la section.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Texte d’introduction. Les cartes de piliers sont générées automatiquement à partir des pôles « mis en avant sur la home » (collection Pôles & Expertises).',
      },
    },
    appearance,
  ],
}
