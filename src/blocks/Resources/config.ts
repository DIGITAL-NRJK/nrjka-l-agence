import type { Block } from 'payload'

export const Resources: Block = {
  slug: 'resourcesBlock',
  interfaceName: 'ResourcesBlock',
  labels: {
    singular: 'Ressources',
    plural: 'Ressources',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'limit', type: 'number', defaultValue: 3 },
  ],
}
