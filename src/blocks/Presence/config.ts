import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Presence: Block = {
  slug: 'presence',
  interfaceName: 'PresenceBlock',
  labels: {
    singular: 'Carte de présence',
    plural: 'Carte de présence',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'locations',
      type: 'array',
      labels: { singular: 'Point de présence', plural: 'Points de présence' },
      admin: {
        description:
          'Les implantations de l’agence. La carte se recadre automatiquement sur l’ensemble des points.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', required: true, admin: { width: '50%' }, label: 'Ville' },
            {
              name: 'country',
              type: 'text',
              required: true,
              admin: { width: '50%' },
              label: 'Pays',
            },
          ],
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Adresse',
          admin: { description: 'Laisser vide affiche « Adresse à venir ».' },
        },
        { name: 'phone', type: 'text', label: 'Téléphone' },
        {
          type: 'row',
          fields: [
            {
              name: 'lat',
              type: 'number',
              required: true,
              admin: { width: '50%', description: 'Latitude (ex. Paris = 48.8566).' },
            },
            {
              name: 'lng',
              type: 'number',
              required: true,
              admin: { width: '50%', description: 'Longitude (ex. Paris = 2.3522).' },
            },
          ],
        },
        {
          name: 'isHeadquarters',
          type: 'checkbox',
          label: 'Siège',
          defaultValue: false,
        },
      ],
    },
    appearance,
  ],
}
