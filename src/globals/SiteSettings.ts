import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { DEFAULT_PALETTE, PALETTES } from '@/utilities/palettes'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  admin: {
    description:
      'Réglages globaux : SEO par défaut, réseaux sociaux, coordonnées, mesure d’audience et mode maintenance.',
    group: 'Paramètres',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag('global_site-settings', 'max')
        revalidateTag('global_site-settings_fr', 'max')
        revalidateTag('global_site-settings_en', 'max')
      },
    ],
  },
  fields: [
    // ─── Apparence / palette de couleurs ────────────────────────────────────────
    {
      name: 'appearance',
      type: 'group',
      label: '🎨 Apparence',
      admin: {
        description:
          'Palette de couleurs du site public. Le choix s’applique à tout le site ; chaque palette a sa variante claire et sombre (le visiteur garde son réglage clair/sombre).',
      },
      fields: [
        {
          name: 'colorScheme',
          type: 'select',
          label: 'Palette de couleurs',
          defaultValue: DEFAULT_PALETTE,
          required: true,
          options: PALETTES.map(({ value, label }) => ({ value, label })),
          admin: {
            components: {
              Field: '@/components/admin/PaletteField#PaletteField',
            },
          },
        },
      ],
    },

    // ─── SEO par défaut ─────────────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: '🔎 Référencement (SEO) par défaut',
      admin: {
        description:
          'Valeurs de repli utilisées quand une page n’a pas son propre SEO. Le SEO par page (onglet SEO de chaque contenu) reste prioritaire.',
      },
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Nom du site / marque',
          defaultValue: 'NRJKA',
          admin: {
            description:
              'Utilisé dans le titre des onglets et les données structurées (ex. « NRJKA »).',
          },
        },
        {
          name: 'titleSuffix',
          type: 'text',
          label: 'Suffixe de titre',
          defaultValue: '— NRJKA',
          admin: {
            description:
              'Ajouté après le titre de chaque page (ex. « Nos services — NRJKA »). Laisser vide pour aucun suffixe.',
          },
        },
        {
          name: 'defaultMetaTitle',
          type: 'text',
          label: 'Titre par défaut',
          localized: true,
          admin: {
            description: 'Titre affiché pour une page sans titre SEO propre.',
          },
        },
        {
          name: 'defaultMetaDescription',
          type: 'textarea',
          label: 'Description par défaut',
          localized: true,
          admin: {
            description: 'Meta description de repli (≈ 150–160 caractères).',
          },
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Image de partage par défaut (Open Graph)',
          admin: {
            description:
              'Image affichée quand un lien du site est partagé (réseaux sociaux, messageries). Recommandé : 1200 × 630 px.',
          },
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: '🚫 Empêcher l’indexation de tout le site',
          defaultValue: false,
          admin: {
            description:
              'À n’activer que pour un site en construction : ajoute une directive « noindex » sur l’ensemble du site.',
          },
        },
      ],
    },

    // ─── Réseaux sociaux ────────────────────────────────────────────────────────
    {
      name: 'social',
      type: 'group',
      label: '🔗 Réseaux sociaux',
      admin: {
        description:
          'Liens vers vos profils. Utilisés dans le pied de page et les données structurées (sameAs). Laisser un champ vide pour le masquer.',
      },
      fields: [
        { name: 'linkedin', type: 'text', label: 'LinkedIn (URL)' },
        { name: 'instagram', type: 'text', label: 'Instagram (URL)' },
        { name: 'facebook', type: 'text', label: 'Facebook (URL)' },
        { name: 'twitter', type: 'text', label: 'X / Twitter (URL)' },
        { name: 'youtube', type: 'text', label: 'YouTube (URL)' },
        { name: 'tiktok', type: 'text', label: 'TikTok (URL)' },
      ],
    },

    // ─── Coordonnées ────────────────────────────────────────────────────────────
    {
      name: 'contact',
      type: 'group',
      label: '📇 Coordonnées',
      admin: {
        description:
          'Coordonnées publiques de l’agence. Utilisées dans le pied de page, la page contact et les données structurées.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'email', label: 'E-mail public', admin: { width: '50%' } },
            { name: 'phone', type: 'text', label: 'Téléphone', admin: { width: '50%' } },
          ],
        },
        { name: 'addressLine', type: 'text', label: 'Adresse (rue)' },
        {
          type: 'row',
          fields: [
            { name: 'postalCode', type: 'text', label: 'Code postal', admin: { width: '30%' } },
            { name: 'city', type: 'text', label: 'Ville', admin: { width: '40%' } },
            { name: 'country', type: 'text', label: 'Pays', defaultValue: 'France', admin: { width: '30%' } },
          ],
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: 'Lien Google Maps (optionnel)',
          admin: { description: 'Lien « Itinéraire » affiché sur la page contact.' },
        },
      ],
    },

    // ─── Mesure d'audience / Analytics ──────────────────────────────────────────
    {
      name: 'analytics',
      type: 'group',
      label: '📊 Mesure d’audience',
      admin: {
        description:
          'Identifiants de suivi. Laisser vide pour désactiver : un script ne se charge que si son identifiant est renseigné.',
      },
      fields: [
        {
          name: 'ga4MeasurementId',
          type: 'text',
          label: 'Google Analytics 4 — ID de mesure',
          admin: { description: 'Format G-XXXXXXXXXX.' },
        },
        {
          name: 'gtmContainerId',
          type: 'text',
          label: 'Google Tag Manager — ID de conteneur',
          admin: { description: 'Format GTM-XXXXXXX.' },
        },
        {
          name: 'metaPixelId',
          type: 'text',
          label: 'Meta (Facebook) Pixel — ID',
        },
        {
          name: 'linkedinPartnerId',
          type: 'text',
          label: 'LinkedIn Insight — Partner ID',
        },
      ],
    },

    // ─── Mode maintenance / coming soon (inchangé) ──────────────────────────────
    {
      name: 'maintenanceMode',
      type: 'group',
      label: 'Mode maintenance / coming soon',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: '🔒 Activer le mode maintenance',
          defaultValue: false,
          admin: {
            description:
              'Quand activé, toutes les pages publiques affichent la page de maintenance (admin et prévisualisation restent accessibles).',
          },
        },
        {
          name: 'mode',
          type: 'select',
          label: 'Type',
          defaultValue: 'maintenance',
          options: [
            { label: '🔧 Maintenance', value: 'maintenance' },
            { label: '🚀 Coming Soon', value: 'coming_soon' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titre de la page',
          localized: true,
          defaultValue: 'Site en maintenance',
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          localized: true,
          defaultValue: 'Nous effectuons une maintenance. Revenez bientôt.',
        },
        {
          name: 'countdownDate',
          type: 'date',
          label: 'Date de lancement (coming soon)',
          admin: {
            condition: (data) => data?.maintenanceMode?.mode === 'coming_soon',
            description: 'Affiche un compte à rebours si la date est dans le futur.',
          },
        },
        {
          name: 'allowedIps',
          type: 'array',
          label: 'IPs autorisées (bypass maintenance)',
          admin: {
            description: 'Ces IPs voient le site normal même en mode maintenance.',
          },
          fields: [
            {
              name: 'ip',
              type: 'text',
              label: 'Adresse IP',
            },
          ],
        },
      ],
    },
  ],
}
