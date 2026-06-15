import type { CollectionConfig } from 'payload'

import { adminOnly, adminOrSelf, authenticatedRead } from '../../access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Visiteur exclu du back-office ; seul un admin gère les comptes ; chacun édite son profil.
    admin: ({ req: { user } }) =>
      Boolean(user && ['admin', 'editor', 'contributor'].includes(user.role as string)),
    create: adminOnly,
    delete: adminOnly,
    read: authenticatedRead,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    description:
      'Les comptes qui accèdent au back-office (administrateurs, éditeurs). Réservé aux personnes de l’équipe.',
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
