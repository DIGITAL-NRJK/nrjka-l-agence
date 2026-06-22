import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { publicRead, adminOnly } from '../access'

// Éditeur riche (avec Titres) — nécessaire pour le contenu des services.
const richEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pole', 'published', 'updatedAt'],
    group: 'Contenu',
    description:
      'Les offres granulaires de l’agence (ex. Sites vitrines, SEO, Maintenance, Formation…). Chaque service est rattaché à un pôle (collection Pôles & Expertises) et peut être lié à des études de cas.',
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
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
    { name: 'long_description', type: 'richText', editor: richEditor, label: 'Description longue' },
    {
      name: 'long_description_en',
      type: 'richText',
      editor: richEditor,
      label: 'Description longue (EN)',
    },
    {
      name: 'pole',
      type: 'relationship',
      relationTo: 'expertises',
      required: true,
      label: 'Pôle / Expertise',
      admin: {
        description:
          'Le pôle auquel ce service appartient (ex. « Digitalisation & Process » pour la Maintenance ou la Formation).',
      },
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
      name: 'besoins',
      type: 'array',
      label: 'Besoins',
      admin: {
        description:
          'Les besoins précis couverts par ce service (ex. Maintenance préventive, Sécurité…). Proposés en cases à cocher dans le formulaire de contact (3e niveau : Pôle → Service → Besoins).',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'description',
          type: 'text',
          localized: true,
          admin: { description: 'Courte précision (optionnel).' },
        },
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
      name: 'related_articles',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Articles liés (pour approfondir)',
      admin: {
        description:
          'Les articles de blog qui approfondissent ce service. Affichés dans la section « Pour approfondir » de la page service.',
      },
    },
    {
      name: 'autoTranslate',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/TranslateButton',
        },
      },
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
