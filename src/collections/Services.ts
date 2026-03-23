import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'published', 'updatedAt'],
    group: 'Contenu',
  },
  access: {
    read: publicRead,
    create: editorOrAdmin,
    update: editorOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Titre' },
    { name: 'title_en', type: 'text', label: 'Titre (EN)' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'textarea', required: true, label: 'Description courte' },
    { name: 'description_en', type: 'textarea', label: 'Description courte (EN)' },
    { name: 'long_description', type: 'richText', label: 'Description longue' },
    { name: 'long_description_en', type: 'richText', label: 'Description longue (EN)' },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Catégorie',
      options: [
        { label: 'Web & Mobile', value: 'web-mobile' },
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'SEO & Visibilité', value: 'seo' },
        { label: 'Automation & CRM', value: 'automation' },
        { label: 'Maintenance & Support', value: 'maintenance' },
        { label: 'Formation', value: 'training' },
        { label: 'Hébergement', value: 'hosting' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icône (nom Lucide)',
      admin: { description: 'Ex: Globe, Code, Search...' },
    },
    { name: 'pricing_start', type: 'number', label: 'Prix à partir de (€)' },
    {
      name: 'features',
      type: 'array',
      label: 'Fonctionnalités incluses',
      fields: [
        { name: 'feature', type: 'text', required: true },
        { name: 'feature_en', type: 'text' },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Avantages',
      fields: [
        { name: 'benefit', type: 'text', required: true },
        { name: 'benefit_en', type: 'text' },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      label: 'Technologies utilisées',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'process_steps',
      type: 'array',
      label: 'Étapes du processus',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQ du service',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
        { name: 'question_en', type: 'text' },
        { name: 'answer_en', type: 'textarea' },
      ],
    },
    {
      name: 'related_services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Services liés',
    },
    {
      name: 'case_studies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      label: 'Études de cas associées',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publié',
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', label: "Ordre d'affichage", admin: { position: 'sidebar' } },
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
