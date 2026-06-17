import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const ResourcesCatalog: Block = {
  slug: 'resourcesCatalog',
  interfaceName: 'ResourcesCatalogBlock',
  labels: {
    singular: 'Catalogue Ressources',
    plural: 'Catalogue Ressources',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'Petit libellé avec trait (ex. « Ressources »).' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Titre principal de la page (H1).' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: { description: 'Chapô sous le titre.' },
    },
    appearance,
  ],
}
