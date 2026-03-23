import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: {
    useAsTitle: 'author_name',
    defaultColumns: ['author_name', 'company', 'rating', 'updatedAt'],
    group: 'Contenu',
  },
  access: {
    read: publicRead,
    create: editorOrAdmin,
    update: editorOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: 'author_name', type: 'text', required: true, label: 'Nom' },
    { name: 'author_role', type: 'text', label: 'Poste' },
    { name: 'company', type: 'text', label: 'Entreprise' },
    { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Photo' },
    { name: 'avatar_url', type: 'text', label: 'URL avatar (externe)' },
    { name: 'content', type: 'textarea', required: true, label: 'Témoignage' },
    { name: 'content_en', type: 'textarea', label: 'Témoignage (EN)' },
    { name: 'rating', type: 'number', label: 'Note', min: 1, max: 5 },
    { name: 'order', type: 'number', label: "Ordre d'affichage", admin: { position: 'sidebar' } },
  ],
}
