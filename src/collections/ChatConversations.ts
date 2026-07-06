import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

// Historique des conversations du chatbot (choix produit : conservation activée).
// RGPD : ne stocker AUCUNE donnée d'identification directe ici. Le consentement de
// l'utilisateur est requis côté widget avant tout envoi (voir ChatWidget).
// Rétention : à purger périodiquement (ex. > 12 mois) — à cadrer dans la politique de conf.
export const ChatConversations: CollectionConfig = {
  slug: 'chat-conversations',
  labels: { singular: 'Conversation (IA)', plural: 'Conversations du chatbot (IA)' },
  admin: {
    group: 'IA',
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'locale', 'turns', 'updatedAt'],
    description:
      'Échanges avec le chatbot, conservés (avec consentement) pour analyser et améliorer les réponses. Purger régulièrement selon la politique de rétention.',
  },
  access: {
    // Écrit uniquement par la route serveur /api/chat (API locale — bypass access).
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'summary',
      type: 'text',
      label: 'Aperçu',
      admin: { description: 'Début de la première question (repère de lecture).' },
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
    {
      name: 'turns',
      type: 'number',
      label: 'Nb de messages',
      admin: { readOnly: true },
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Consentement à la conservation',
      defaultValue: false,
    },
    {
      name: 'messages',
      type: 'array',
      label: 'Messages',
      labels: { singular: 'Message', plural: 'Messages' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Utilisateur', value: 'user' },
            { label: 'Assistant', value: 'assistant' },
          ],
        },
        { name: 'content', type: 'textarea' },
        { name: 'at', type: 'text', admin: { description: 'Horodatage ISO.' } },
      ],
    },
  ],
}
