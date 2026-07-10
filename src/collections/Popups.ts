import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

const revalidatePopups = () => {
  revalidateTag('popups', 'max')
  revalidateTag('popups_fr', 'max')
  revalidateTag('popups_en', 'max')
}

/**
 * Pop-ups marketing pilotables depuis l'admin.
 * 4 modèles d'affichage × 3 déclencheurs × ciblage par page/langue + fenêtre de dates.
 * Lecture publique : le layout charge les pop-ups actives et les passe au PopupManager (client).
 */
export const Popups: CollectionConfig = {
  slug: 'popups',
  labels: { singular: 'Pop-up', plural: 'Pop-ups' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'template', 'trigger', 'enabled', 'updatedAt'],
    group: 'Marketing',
    description:
      'Fenêtres marketing (promo, annonce, capture email…). Choisissez un modèle, un déclencheur, les pages et la langue où l’afficher.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidatePopups],
    afterDelete: [revalidatePopups],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom interne',
      admin: { description: 'Non affiché aux visiteurs. Sert à identifier la pop-up dans l’admin.' },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      label: '✅ Activer',
      admin: { position: 'sidebar' },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      label: 'Priorité',
      admin: {
        position: 'sidebar',
        description: 'Si plusieurs pop-ups ciblent la même page, la priorité la plus haute s’affiche.',
      },
    },

    // ─── Modèle ────────────────────────────────────────────────────────────
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'modal',
      label: 'Modèle d’affichage',
      options: [
        { label: '🪟 Modale centrée', value: 'modal' },
        { label: '⬇️ Bandeau bas', value: 'banner-bottom' },
        { label: '↘️ Slide-in (coin)', value: 'slide-in' },
        { label: '⬆️ Barre en haut', value: 'top-bar' },
      ],
    },

    // ─── Contenu ───────────────────────────────────────────────────────────
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: 'Titre',
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      label: 'Texte',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (optionnelle)',
      admin: {
        description: 'Affichée par les modèles « Modale centrée » et « Slide-in ».',
        condition: (_, sibling) => ['modal', 'slide-in'].includes(sibling?.template),
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      label: 'Libellé du bouton',
      admin: { description: 'Laisser vide pour masquer le bouton.' },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Lien du bouton',
      admin: { description: 'URL ou chemin, ex. « /contact » ou « https://… ».' },
    },
    {
      name: 'dismissible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Bouton de fermeture (×)',
    },

    // ─── Déclencheur ───────────────────────────────────────────────────────
    {
      name: 'trigger',
      type: 'select',
      defaultValue: 'load',
      label: 'Déclencheur',
      options: [
        { label: '⏱️ À l’ouverture / après un délai', value: 'load' },
        { label: '📜 Au défilement', value: 'scroll' },
        { label: '🚪 Intention de sortie (exit-intent)', value: 'exit' },
      ],
    },
    {
      name: 'delaySeconds',
      type: 'number',
      defaultValue: 3,
      label: 'Délai (secondes)',
      admin: {
        condition: (_, sibling) => sibling?.trigger === 'load',
        description: '0 = affichage immédiat.',
      },
    },
    {
      name: 'scrollPercent',
      type: 'number',
      defaultValue: 40,
      label: 'Défilement (%)',
      admin: {
        condition: (_, sibling) => sibling?.trigger === 'scroll',
        description: 'Pourcentage de la page atteint avant affichage.',
      },
    },

    // ─── Fréquence ─────────────────────────────────────────────────────────
    {
      name: 'frequency',
      type: 'select',
      defaultValue: 'session',
      label: 'Fréquence',
      options: [
        { label: 'Une fois par session', value: 'session' },
        { label: 'Une seule fois (mémorisé)', value: 'once' },
        { label: 'À chaque visite', value: 'always' },
      ],
    },

    // ─── Ciblage ───────────────────────────────────────────────────────────
    {
      name: 'showOn',
      type: 'select',
      defaultValue: 'all',
      label: 'Pages',
      options: [
        { label: 'Toutes les pages', value: 'all' },
        { label: 'Uniquement certaines pages', value: 'include' },
        { label: 'Partout sauf certaines pages', value: 'exclude' },
      ],
    },
    {
      name: 'paths',
      type: 'array',
      label: 'Chemins',
      admin: {
        condition: (_, sibling) => sibling?.showOn !== 'all',
        description: 'Ex. « /contact », « /blog ». Correspondance par début de chemin (sans la langue).',
      },
      fields: [{ name: 'path', type: 'text', label: 'Chemin' }],
    },
    {
      name: 'localeFilter',
      type: 'select',
      defaultValue: 'all',
      label: 'Langue',
      options: [
        { label: 'Toutes', value: 'all' },
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
    },

    // ─── Programmation ─────────────────────────────────────────────────────
    {
      name: 'startDate',
      type: 'date',
      label: 'Début (optionnel)',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Fin (optionnel)',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
