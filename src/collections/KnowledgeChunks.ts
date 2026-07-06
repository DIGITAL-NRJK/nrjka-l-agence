import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

// Base de connaissances vectorielle du chatbot (RAG).
// Alimentée par la route /reindex-kb à partir du contenu publié du site.
// L'embedding est stocké en JSON (number[]) — corpus modeste, recherche cosinus en mémoire.
export const KnowledgeChunks: CollectionConfig = {
  slug: 'knowledge-chunks',
  labels: { singular: 'Fragment de connaissance', plural: 'Base de connaissances (IA)' },
  admin: {
    group: 'IA',
    useAsTitle: 'title',
    defaultColumns: ['title', 'locale', 'sourceCollection', 'updatedAt'],
    description:
      'Fragments de contenu indexés pour le chatbot (générés automatiquement via /reindex-kb). Ne pas éditer à la main : le contenu est réécrit à chaque réindexation.',
    hidden: false,
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Titre source' },
    { name: 'text', type: 'textarea', label: 'Fragment' },
    {
      name: 'embedding',
      type: 'json',
      label: 'Vecteur',
      admin: { description: 'Vecteur d’embedding (mistral-embed). Généré automatiquement.' },
    },
    {
      name: 'locale',
      type: 'select',
      label: 'Langue',
      defaultValue: 'fr',
      options: [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
    },
    { name: 'sourceCollection', type: 'text', label: 'Collection source' },
    { name: 'sourceId', type: 'text', label: 'ID source' },
    { name: 'url', type: 'text', label: 'URL (citation)' },
  ],
}
