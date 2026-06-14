import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: 'Ressource', plural: 'Ressources' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'format', 'downloads', 'updatedAt'],
    group: 'Contenu',
    description:
      'Les ressources gratuites téléchargeables (guides, modèles, checklists) affichées dans la section « Ressources » de la home. Une ressource n’apparaît que si elle est cochée « Publié ».',
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
    { name: 'description', type: 'textarea', required: true, label: 'Description' },
    { name: 'description_en', type: 'textarea', label: 'Description (EN)' },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Template', value: 'template' },
        { label: 'Checklist', value: 'checklist' },
        { label: 'Ebook', value: 'ebook' },
        { label: 'Outil', value: 'tool' },
      ],
    },
    {
      name: 'format',
      type: 'select',
      label: 'Format',
      options: [
        { label: 'PDF', value: 'pdf' },
        { label: 'Word', value: 'docx' },
        { label: 'Excel', value: 'xlsx' },
        { label: 'Notion', value: 'notion' },
        { label: 'Figma', value: 'figma' },
        { label: 'Autre', value: 'other' },
      ],
    },
    { name: 'file', type: 'upload', relationTo: 'media', label: 'Fichier' },
    { name: 'file_url', type: 'text', label: 'URL du fichier (si externe)' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', label: 'Miniature' },
    { name: 'preview_url', type: 'text', label: 'URL de prévisualisation' },
    {
      name: 'features',
      type: 'array',
      label: 'Points clés',
      fields: [
        { name: 'feature', type: 'text', required: true },
        { name: 'feature_en', type: 'text' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'is_free',
      type: 'checkbox',
      defaultValue: true,
      label: 'Gratuit',
      admin: { position: 'sidebar' },
    },
    {
      name: 'requires_contact',
      type: 'checkbox',
      defaultValue: false,
      label: 'Requiert un email',
      admin: { position: 'sidebar' },
    },
    {
      name: 'downloads',
      type: 'number',
      defaultValue: 0,
      label: 'Nombre de téléchargements',
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publié',
      admin: { position: 'sidebar' },
    },
  ],
}
