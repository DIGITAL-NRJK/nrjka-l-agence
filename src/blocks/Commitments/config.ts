import type { Block } from 'payload'

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
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
