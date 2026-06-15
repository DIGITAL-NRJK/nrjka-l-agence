import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'
import { iconOptions } from '@/utilities/icons'

export const Distinctions: Block = {
  slug: 'distinctions',
  interfaceName: 'DistinctionsBlock',
  labels: {
    singular: 'Distinctions',
    plural: 'Distinctions',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      localized: true,
      maxRows: 6,
      labels: { singular: 'Distinction', plural: 'Distinctions' },
      admin: {
        initCollapsed: true,
        description: 'Ce qui vous distingue (icône + titre + courte explication).',
      },
      fields: [
        { name: 'icon', type: 'select', defaultValue: 'shield', options: iconOptions },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    appearance,
  ],
}
