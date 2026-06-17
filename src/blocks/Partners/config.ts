import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Partners: Block = {
  slug: 'partners',
  interfaceName: 'PartnersBlock',
  labels: {
    singular: 'Expertise & réalisations',
    plural: 'Expertise & réalisations',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'projectsLimit',
      type: 'number',
      defaultValue: 3,
      admin: {
        description: 'Nombre de projets « Mis en avant » à afficher (cochés dans Études de cas).',
      },
    },
    {
      name: 'techLabel',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Petit titre au-dessus des technologies (ex. « Les technologies derrière nos projets »).',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      maxRows: 24,
      admin: { initCollapsed: true },
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'category',
          type: 'select',
          defaultValue: 'web',
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Data', value: 'data' },
            { label: 'Automatisation', value: 'automation' },
            { label: 'IA', value: 'ai' },
            { label: 'Sécurité', value: 'security' },
            { label: 'Autre', value: 'other' },
          ],
        },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'openSource', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
    appearance,
  ],
}
