import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    description:
      'Le pied de page du site. Les liens ajoutés ici apparaissent dans le footer (accueil, contact, mentions légales, confidentialité…).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tagline',
      type: 'textarea',
      localized: true,
      label: 'Slogan (sous le logo)',
      admin: {
        description:
          'Défaut : « Votre partenaire digital et stratégique pour construire une croissance durable. »',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description (sous le slogan)',
      admin: {
        description:
          'Défaut : « Agence digitale humaine — sites web, SEO, automatisation et CRM, pour une croissance durable. »',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Liens du footer (colonne)',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Liens légaux (bas de page)',
      maxRows: 4,
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        description: 'Vide = « Mentions légales » + « Confidentialité » par défaut.',
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'copyright',
      type: 'text',
      localized: true,
      label: 'Mention de copyright',
      admin: {
        description: 'Affiché après « © {année} ». Défaut : « NRJKA. Tous droits réservés. »',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
