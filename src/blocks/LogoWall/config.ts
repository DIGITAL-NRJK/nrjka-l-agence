import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const LogoWall: Block = {
  slug: 'logoWall',
  interfaceName: 'LogoWallBlock',
  labels: {
    singular: 'Mur de logos',
    plural: 'Murs de logos',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'logos',
      type: 'array',
      maxRows: 24,
      labels: { singular: 'Logo', plural: 'Logos' },
      admin: {
        initCollapsed: true,
        description:
          'Logos clients / partenaires (image + nom). Réorganisables. Un fond transparent (PNG/SVG) rend le mieux.',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'De préférence PNG/SVG à fond transparent.' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Nom du client (sert de texte alternatif et d’info-bulle).' },
        },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Lien optionnel (site du client ou étude de cas).' },
        },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Logos en niveaux de gris, révélés en couleur au survol (recommandé pour une bande sobre).',
      },
    },
    appearance,
  ],
}
