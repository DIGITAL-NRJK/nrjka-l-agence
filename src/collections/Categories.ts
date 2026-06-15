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
    slugField({
      position: undefined,
    }),
  ],
}
