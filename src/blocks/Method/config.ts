import type { Block } from 'payload'

export const Method: Block = {
  slug: 'method',
  interfaceName: 'MethodBlock',
  labels: {
    singular: 'Méthode',
    plural: 'Méthodes',
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
      name: 'steps',
      type: 'array',
      localized: true,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'tagline', type: 'text' },
        {
          name: 'activities',
          type: 'array',
          fields: [{ name: 'label', type: 'text' }],
        },
      ],
    },
  ],
}
