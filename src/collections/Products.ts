import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produit', plural: 'Produits' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'category', 'bestseller', 'updatedAt'],
    group: 'E-commerce',
    description:
      'Catalogue de produits (boutique). Non utilisé sur le site vitrine actuel — réservé à une future activité e-commerce.',
  },
  access: {
    read: publicRead,
    create: editorOrAdmin,
    update: editorOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Nom du produit' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'textarea', required: true, label: 'Description courte' },
    { name: 'longDescription', type: 'richText', label: 'Description détaillée' },
    { name: 'price', type: 'number', required: true, label: 'Prix (€)', min: 0 },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Image principale' },
    {
      name: 'gallery',
      type: 'array',
      label: "Galerie d'images",
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      options: [
        { label: 'Templates', value: 'templates' },
        { label: 'Formations', value: 'formations' },
        { label: 'Outils', value: 'tools' },
        { label: 'Packs', value: 'packs' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Caractéristiques',
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    {
      name: 'includes',
      type: 'array',
      label: 'Ce qui est inclus',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Avantages',
      fields: [{ name: 'benefit', type: 'text', required: true }],
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Note moyenne',
      min: 0,
      max: 5,
      admin: { position: 'sidebar' },
    },
    { name: 'reviews', type: 'number', label: "Nombre d'avis", admin: { position: 'sidebar' } },
    {
      name: 'bestseller',
      type: 'checkbox',
      defaultValue: false,
      label: 'Best-seller',
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      label: 'ID Produit Stripe',
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      label: 'ID Prix Stripe',
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publié',
      admin: { position: 'sidebar' },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Titre SEO' },
        { name: 'metaDescription', type: 'textarea', label: 'Description SEO' },
      ],
    },
  ],
}
