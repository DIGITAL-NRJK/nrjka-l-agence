import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'visitor',
      label: 'Rôle',
      options: [
        { label: 'Super Admin', value: 'admin' },
        { label: 'Éditeur', value: 'editor' },
        { label: 'Contributeur', value: 'contributor' },
        { label: 'Visiteur', value: 'visitor' },
      ],
      access: {
        update: ({ req: { user } }) => Boolean((user?.role as string) === 'admin'),
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'Prénom',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Nom',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
