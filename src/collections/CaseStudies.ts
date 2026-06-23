import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { publicRead, adminOnly } from '../access'

const richEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Étude de cas', plural: 'Études de cas' },
  admin: {
    useAsTitle: 'client_name',
    defaultColumns: ['client_name', 'industry', 'is_featured', 'updatedAt'],
    group: 'Contenu',
    components: {
      beforeListTable: [
        {
          path: '@/components/admin/TranslateCollectionButton',
          clientProps: { slug: 'case-studies', label: 'Réalisations' },
        },
      ],
    },
    description:
      'Vos projets / références clients. Chaque étude de cas alimente la page /realisations (liste filtrable) et sa page détail. Reliez-la à un ou plusieurs pôles pour qu’elle apparaisse aussi sur les pages d’expertise concernées. Cochez « Mis en avant » pour la montrer sur la page d’accueil.',
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'client_name', type: 'text', required: true, label: 'Nom du client' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: { position: 'sidebar' },
    },
    { name: 'excerpt', type: 'textarea', label: 'Résumé court' },
    { name: 'excerpt_en', type: 'textarea', label: 'Résumé court (EN)' },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'case-study-sectors',
      label: 'Secteur',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'case-study-types',
      label: 'Type de projet',
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Image principale' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo du client' },
    { name: 'challenge', type: 'richText', editor: richEditor, label: 'Défi / Problématique' },
    { name: 'challenge_en', type: 'richText', editor: richEditor, label: 'Défi (EN)' },
    { name: 'solution', type: 'richText', editor: richEditor, label: 'Solution apportée' },
    { name: 'solution_en', type: 'richText', editor: richEditor, label: 'Solution (EN)' },
    { name: 'results', type: 'richText', editor: richEditor, label: 'Résultats obtenus' },
    { name: 'results_en', type: 'richText', editor: richEditor, label: 'Résultats (EN)' },
    {
      name: 'metrics',
      type: 'array',
      label: 'Métriques clés',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      label: 'Technologies utilisées',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'services_used',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Services utilisés',
      admin: { description: 'Les services granulaires mobilisés sur ce projet (optionnel).' },
    },
    {
      name: 'expertises',
      type: 'relationship',
      relationTo: 'expertises',
      hasMany: true,
      label: 'Pôles concernés',
      admin: {
        description:
          'Les pôles d’expertise dont relève ce projet. Il s’affichera dans la section « Projets » de chaque page de pôle sélectionnée.',
      },
    },
    { name: 'duration', type: 'text', label: 'Durée du projet' },
    { name: 'team_size', type: 'number', label: "Taille de l'équipe" },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Témoignages clients',
      admin: {
        description:
          'Un ou plusieurs témoignages (différentes personnes / équipes du même projet).',
      },
      fields: [
        { name: 'quote', type: 'textarea', label: 'Témoignage' },
        { name: 'quote_en', type: 'textarea', label: 'Témoignage (EN)' },
        { name: 'author', type: 'text', label: 'Auteur' },
        { name: 'author_role', type: 'text', label: "Fonction de l'auteur" },
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
