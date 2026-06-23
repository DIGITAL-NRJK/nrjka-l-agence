import type { CollectionConfig } from 'payload'
import { publicRead, adminOnly } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: {
    useAsTitle: 'author_name',
    defaultColumns: ['author_name', 'company', 'rating', 'updatedAt'],
    group: 'Contenu',
    components: {
      beforeListTable: [
        {
          path: '@/components/admin/TranslateCollectionButton',
          clientProps: { slug: 'testimonials', label: 'Témoignages' },
        },
      ],
    },
    description:
      'Les avis clients affichés dans la section « Témoignages » de la page d’accueil. Renseignez l’auteur, son entreprise, le texte et une note ; ajoutez une photo pour plus d’impact.',
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
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
