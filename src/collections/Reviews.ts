import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Avis', plural: 'Avis clients' },
  admin: {
    useAsTitle: 'author_name',
    defaultColumns: ['author_name', 'rating', 'service_category', 'approved', 'createdAt'],
    group: 'CRM',
    description:
      'Les avis laissés par les visiteurs via un formulaire public (différents des Témoignages, que vous sélectionnez vous-même). À approuver avant tout affichage.',
  },
  access: {
    read: publicRead,
    create: publicRead, // Les visiteurs peuvent laisser un avis
    update: editorOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: 'author_name', type: 'text', required: true, label: "Nom de l'auteur" },
    { name: 'author_role', type: 'text', label: 'Poste / Rôle' },
    { name: 'company', type: 'text', label: 'Entreprise' },
    { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Photo' },
    {
      name: 'avatar_url',
      type: 'text',
      label: 'URL avatar (externe)',
      admin: { description: "Si pas d'upload, URL directe" },
    },
    { name: 'rating', type: 'number', required: true, label: 'Note', min: 1, max: 5 },
    { name: 'content', type: 'textarea', required: true, label: "Contenu de l'avis" },
    {
      name: 'service_category',
      type: 'select',
      label: 'Service évalué',
      options: [
        { label: 'Développement Web', value: 'web' },
        { label: 'SEO', value: 'seo' },
        { label: 'Automation', value: 'automation' },
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Formation', value: 'training' },
        { label: 'Général', value: 'general' },
      ],
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mis en avant',
      admin: { position: 'sidebar' },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Approuvé',
      admin: { position: 'sidebar' },
    },
  ],
}
