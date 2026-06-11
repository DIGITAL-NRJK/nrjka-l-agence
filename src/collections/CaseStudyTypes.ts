import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const CaseStudyTypes: CollectionConfig = {
  slug: 'case-study-types',
  labels: { singular: 'Type de projet', plural: 'Types de projet' },
  admin: { useAsTitle: 'name', group: 'Contenu' },
  access: { read: publicRead, create: editorOrAdmin, update: editorOrAdmin, delete: adminOnly },
  fields: [{ name: 'name', type: 'text', required: true, label: 'Nom' }],
}
