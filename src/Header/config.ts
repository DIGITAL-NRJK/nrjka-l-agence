import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    description:
      'La navigation principale du site. Les liens ajoutés ici apparaissent dans le menu (en haut sur ordinateur, dans le menu burger sur mobile).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'Liens du menu (ex. Blog → /posts). Le « Services » avec méga-menu est ajouté automatiquement.',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'megamenu',
      type: 'group',
      label: 'Méga-menu « Services »',
      admin: {
        description:
          'Le contenu du méga-menu (pôles et services) vient des collections Pôles & Expertises et Services. Ici, vous gérez seulement les libellés et les boutons.',
      },
      fields: [
        {
          name: 'triggerLabel',
          type: 'text',
          defaultValue: 'Services',
          label: 'Libellé dans la nav',
          admin: { description: 'Le mot cliquable dans le menu (ex. « Services », « Nos expertises »).' },
        },
        {
          name: 'navPosition',
          type: 'number',
          defaultValue: 1,
          min: 1,
          label: 'Position dans le menu',
          admin: {
            description:
              'Place le « Services » parmi les autres liens. 1 = en premier. Ex. avec Accueil, L’Agence, Réalisations… mettre 3 pour l’afficher après « L’Agence ».',
          },
        },
        {
          name: 'railLabel',
          type: 'text',
          defaultValue: 'Pôles principaux',
          label: 'Titre de la colonne des pôles',
        },
        {
          name: 'poles',
          type: 'array',
          label: 'Pôles du méga-menu',
          admin: {
            initCollapsed: true,
            description:
              'Choisissez les pôles à afficher et leur ordre (glisser-déposer). Le nom, le lien et l’icône viennent du pôle sélectionné — vous pouvez juste le renommer si besoin.',
          },
          fields: [
            {
              name: 'pole',
              type: 'relationship',
              relationTo: 'expertises',
              required: true,
              label: 'Pôle',
              admin: { description: 'Choisissez un pôle existant (collection Pôles & Expertises).' },
            },
            {
              name: 'labelOverride',
              type: 'text',
              label: 'Renommer (optionnel)',
              admin: { description: 'Laisser vide = le nom du pôle.' },
            },
            {
              name: 'labelOverrideEn',
              type: 'text',
              label: 'Renommer — anglais (optionnel)',
              admin: { description: 'Nom affiché en version anglaise. Laisser vide = le nom du pôle.' },
            },
            {
              name: 'services',
              type: 'array',
              label: 'Services du pôle',
              admin: {
                initCollapsed: true,
                description:
                  'Choisissez les services à lister sous ce pôle et leur ordre (glisser-déposer).',
              },
              fields: [
                {
                  name: 'service',
                  type: 'relationship',
                  relationTo: 'services',
                  required: true,
                  label: 'Service',
                  admin: { description: 'Choisissez un service existant (collection Services).' },
                },
                {
                  name: 'labelOverride',
                  type: 'text',
                  label: 'Renommer (optionnel)',
                  admin: { description: 'Laisser vide = le nom du service.' },
                },
                {
                  name: 'labelOverrideEn',
                  type: 'text',
                  label: 'Renommer — anglais (optionnel)',
                  admin: { description: 'Nom affiché en version anglaise. Laisser vide = le nom du service.' },
                },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ctaPrimaryLabel', type: 'text', defaultValue: 'Démarrer un projet', admin: { width: '50%' }, label: 'Bouton principal — libellé' },
            { name: 'ctaPrimaryHref', type: 'text', defaultValue: '/contact', admin: { width: '50%' }, label: 'Bouton principal — lien' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ctaSecondaryLabel', type: 'text', defaultValue: 'Parler à un expert', admin: { width: '50%' }, label: 'Bouton secondaire — libellé' },
            { name: 'ctaSecondaryHref', type: 'text', defaultValue: '/contact', admin: { width: '50%' }, label: 'Bouton secondaire — lien' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
