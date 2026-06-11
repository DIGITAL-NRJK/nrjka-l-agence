import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const CaseStudySectors: CollectionConfig = {
  slug: 'case-study-sectors',
  labels: { singular: 'Secteur', plural: 'Secteurs' },
  admin: { useAsTitle: 'name', group: 'Contenu' },
  access: { read: publicRead, create: editorOrAdmin, update: editorOrAdmin, delete: adminOnly },
  fields: [{ name: 'name', type: 'text', required: true, label: 'Nom' }],
}
