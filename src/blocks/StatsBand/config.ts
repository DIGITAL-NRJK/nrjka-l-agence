import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const StatsBand: Block = {
  slug: 'statsBand',
  interfaceName: 'StatsBandBlock',
  labels: {
    singular: 'Bande de chiffres',
    plural: 'Bandes de chiffres',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      maxRows: 4,
      labels: { singular: 'Chiffre', plural: 'Chiffres' },
      admin: {
        initCollapsed: true,
        description: 'Chiffres clés (valeur + libellé). Affichés sur une bande claire.',
      },
      fields: [
        { name: 'value', type: 'text', admin: { description: 'Ex. +33%, 0, D4™.' } },
        { name: 'label', type: 'text', admin: { description: 'Ce que représente la valeur.' } },
      ],
    },
    appearance,
  ],
}
