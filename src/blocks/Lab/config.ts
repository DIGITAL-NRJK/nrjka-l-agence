import type { Block } from 'payload'

export const Lab: Block = {
  slug: 'lab',
  interfaceName: 'LabBlock',
  labels: {
    singular: 'Lab',
    plural: 'Lab',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'demos',
      type: 'array',
      localized: true,
      maxRows: 12,
      admin: { initCollapsed: true },
      fields: [
        { name: 'sector', type: 'text' },
        {
          name: 'stack',
          type: 'array',
          labels: { singular: 'Techno', plural: 'Stack' },
          fields: [{ name: 'label', type: 'text' }],
        },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'soon',
          options: [
            { label: 'En ligne (démo live)', value: 'live' },
            { label: 'Bientôt', value: 'soon' },
          ],
        },
        {
          name: 'previewType',
          type: 'select',
          defaultValue: 'sync',
          admin: {
            description: "Animation d'aperçu (utilisée si aucune capture n'est uploadée).",
          },
          options: [
            { label: 'Synchro / flux', value: 'sync' },
            { label: 'Tableau de bord', value: 'dashboard' },
            { label: 'Agenda / RDV', value: 'calendar' },
            { label: 'Chat / messagerie', value: 'chat' },
            { label: 'Formulaire', value: 'form' },
            { label: 'Contenu / IA', value: 'content' },
            { label: 'Sécurité', value: 'security' },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              "Optionnel : vraie capture animée (GIF/MP4) ou image — remplace l'animation.",
          },
        },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
  ],
}
