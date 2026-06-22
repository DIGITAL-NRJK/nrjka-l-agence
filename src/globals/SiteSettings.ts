import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  admin: {
    description: 'Mode maintenance / coming soon et réglages globaux.',
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
