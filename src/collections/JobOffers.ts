import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const JobOffers: CollectionConfig = {
  slug: 'job-offers',
  labels: { singular: "Offre d'emploi", plural: "Offres d'emploi" },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contract_type', 'location', 'published', 'createdAt'],
    group: 'RH',
    components: {
      beforeListTable: [
        {
          path: '@/components/admin/TranslateCollectionButton',
          clientProps: { slug: 'job-offers', label: 'Offres d’emploi' },
        },
      ],
    },
    description:
      'Les offres d’emploi affichées sur la page recrutement. Une offre n’est visible publiquement que si elle est cochée « Publié ».',
  },
  access: {
    read: publicRead,
    create: editorOrAdmin,
    update: editorOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Titre du poste' },
    { name: 'title_en', type: 'text', label: 'Titre (EN)' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'richText', required: true, label: 'Description du poste' },
    { name: 'description_en', type: 'richText', label: 'Description (EN)' },
    {
      name: 'contract_type',
      type: 'select',
      required: true,
      label: 'Type de contrat',
      options: [
        { label: 'CDI', value: 'cdi' },
        { label: 'CDD', value: 'cdd' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Stage', value: 'internship' },
        { label: 'Alternance', value: 'apprenticeship' },
      ],
    },
    { name: 'location', type: 'text', label: 'Localisation' },
    { name: 'salary_range', type: 'text', label: 'Fourchette salariale' },
    {
      name: 'responsibilities',
      type: 'array',
      label: 'Responsabilités',
      fields: [
        { name: 'item', type: 'text', required: true },
        { name: 'item_en', type: 'text' },
      ],
    },
    {
      name: 'requirements',
      type: 'array',
      label: 'Prérequis',
      fields: [
        { name: 'item', type: 'text', required: true },
        { name: 'item_en', type: 'text' },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Avantages',
      fields: [
        { name: 'item', type: 'text', required: true },
        { name: 'item_en', type: 'text' },
      ],
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
