import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Pillars: Block = {
  slug: 'pillars',
  interfaceName: 'PillarsBlock',
  labels: {
    singular: 'Piliers',
    plural: 'Piliers',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'pillars',
      type: 'array',
      localized: true,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'services',
          type: 'array',
          fields: [{ name: 'label', type: 'text' }],
        },
        { name: 'link', type: 'text' },
      ],
    },
    appearance,
  ],
}
