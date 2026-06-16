import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOnly, editorOrAdmin } from '../access'
import { slugField } from 'payload'

// Calcule un titre « chemin » : « Pôle › Sous-catégorie » (ou le nom seul pour un pôle).
// Stocké → sert d'intitulé (useAsTitle) ET de clé de tri pour grouper les enfants sous leur parent.
const setCategoryPath: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const title = data?.title ?? originalDoc?.title ?? ''
  let parentId: unknown = data?.parent ?? originalDoc?.parent
  if (parentId && typeof parentId === 'object') parentId = (parentId as { id?: unknown }).id

  let path = title
  if (parentId) {
    try {
      const parent = await req.payload.findByID({
        collection: 'categories',
        id: parentId as string | number,
        depth: 0,
      })
      if (parent?.title) path = `${parent.title} › ${title}`
    } catch {
      /* parent introuvable : on garde le titre seul */
    }
  }
  return { ...data, pathTitle: path }
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: editorOrAdmin,
    delete: adminOnly,
    read: anyone,
    update: editorOrAdmin,
  },
  admin: {
    // pathTitle = « Pôle › Sous-catégorie » → hiérarchie lisible et enfants groupés sous leur parent.
    useAsTitle: 'pathTitle',
    defaultColumns: ['pathTitle', 'slug', 'updatedAt'],
    group: 'Contenu',
    description:
      'Catégories de classement des articles. Un pôle = sans parent ; une sous-catégorie = avec un pôle parent (2e niveau du filtre blog).',
  },
  defaultSort: 'pathTitle',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nom',
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
    {
      name: 'pathTitle',
      type: 'text',
      label: 'Intitulé (chemin)',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Calculé automatiquement : « Pôle › Sous-catégorie ».',
        components: {
          // Liste : affiche le nom indenté selon la profondeur (rendu en arbre).
          Cell: '@/components/admin/CategoryTreeCell#CategoryTreeCell',
        },
      },
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    beforeChange: [setCategoryPath],
  },
}
