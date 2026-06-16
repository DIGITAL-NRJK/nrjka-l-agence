import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOnly, editorOrAdmin } from '../access'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: editorOrAdmin,
    delete: adminOnly,
    read: anyone,
    update: editorOrAdmin,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    description: 'Catégories de classement des articles de blog (collection Articles).',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Catégorie parente (pôle)',
      admin: {
        description:
          'Laisser vide pour un pôle de 1er niveau. Choisir un pôle ici pour en faire une sous-catégorie (2e niveau du filtre blog).',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    slugField({
      position: undefined,
    }),
  ],
}
