import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Équipe',
    plural: 'Équipe',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'members',
      type: 'array',
      maxRows: 12,
      labels: { singular: 'Membre', plural: 'Membres' },
      admin: {
        initCollapsed: true,
        description: 'Les membres de l’agence (photo + nom + rôle). Sans photo : initiales sur fond navy.',
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Photo carrée idéalement.' },
        },
        { name: 'name', type: 'text', required: true, admin: { description: 'Prénom Nom.' } },
        { name: 'role', type: 'text', admin: { description: 'Rôle / fonction.' } },
      ],
    },
    appearance,
  ],
}
