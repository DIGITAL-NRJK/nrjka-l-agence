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

export const Expertises: CollectionConfig = {
  slug: 'expertises',
  labels: { singular: 'Pôle / Expertise', plural: 'Pôles & Expertises' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'order', 'published', 'updatedAt'],
    group: 'Contenu',
    description:
      "Les grands domaines d'expertise de l'agence (les « pôles »). Chaque pôle a sa propre page /expertises/[slug] et peut être mis en avant comme pilier sur la page d'accueil. Les services granulaires (collection Services) se rattachent à un pôle.",
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nom du pôle',
      admin: { description: 'Ex. « Web & Expérience ». S’affiche en titre de la carte et de la page.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: {
        position: 'sidebar',
        description: 'Identifiant dans l’URL : /expertises/<slug>. Ex. « web-experience ». Sans espaces ni accents.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icône',
      admin: {
        position: 'sidebar',
        description: 'Nom d’une icône Lucide (ex. Palette, Globe, TrendingUp, Database).',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: 'Sous-titre',
      admin: { description: 'Petite ligne sous le titre, ex. « Stratégie, Design, Création ».' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      label: 'Résumé',
      admin: {
        description: 'Phrase de présentation, affichée sur la carte de la home et en intro de page.',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Mots-clés (tags)',
      admin: {
        description: 'Petits libellés affichés sur la carte de la home (ex. Branding, Copywriting…). 3 à 5 idéalement.',
      },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'long_description',
      type: 'richText',
      editor: richEditor,
      localized: true,
      label: 'Contenu de la page',
      admin: { description: 'Le texte développé affiché sur la page du pôle (titres, paragraphes, listes).' },
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Bénéfices',
      admin: { description: 'Les bénéfices clés, affichés en bandeau (ex. « Reconnaissance immédiate »).' },
      fields: [{ name: 'benefit', type: 'text', required: true, localized: true }],
    },
    {
      name: 'process_steps',
      type: 'array',
      label: 'Notre approche (étapes)',
      admin: { description: 'Les étapes de la méthode pour ce pôle (titre + courte description).' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      label: 'Outils & technologies',
      admin: { description: 'Les outils mis en avant (ex. WordPress, n8n, Matomo…).' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQ du pôle',
      admin: { description: 'Questions fréquentes propres à ce pôle, affichées en accordéon sur la page.' },
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
    {
      name: 'services',
      type: 'join',
      collection: 'services',
      on: 'pole',
      label: 'Services rattachés',
      admin: {
        description: 'Les services granulaires rattachés à ce pôle (gérés dans la collection Services).',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mis en avant sur la home',
      admin: {
        position: 'sidebar',
        description: 'Coché = ce pôle apparaît comme pilier sur la page d’accueil.',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publié',
      admin: { position: 'sidebar', description: 'Décoché = la page n’est pas visible publiquement.' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordre d’affichage',
      admin: { position: 'sidebar', description: 'Plus petit = affiché en premier (home et listes).' },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { description: 'Titre et description pour les moteurs de recherche (optionnel).' },
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Titre SEO' },
        { name: 'metaDescription', type: 'textarea', label: 'Description SEO' },
      ],
    },
  ],
}
