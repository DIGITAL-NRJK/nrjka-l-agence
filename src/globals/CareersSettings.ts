import type { Field, GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

// Tous les textes des pages « Carrières » (liste, candidature spontanée, détail) et
// du formulaire de candidature — pilotables depuis l'admin. Champs localisés (FR/EN).
// Laisser un champ vide = repli sur le texte par défaut codé dans les pages.
const txt = (name: string, label: string, description?: string): Field => ({
  name,
  type: 'text',
  localized: true,
  label,
  ...(description ? { admin: { description } } : {}),
})

const area = (name: string, label: string, description?: string): Field => ({
  name,
  type: 'textarea',
  localized: true,
  label,
  ...(description ? { admin: { description } } : {}),
})

export const CareersSettings: GlobalConfig = {
  slug: 'careers-settings',
  label: 'Carrières (textes)',
  admin: {
    group: 'Contenu',
    description:
      'Tous les libellés des pages Carrières et du formulaire de candidature. Laissez un champ vide pour garder le texte par défaut.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag('global_careers-settings', 'max')
        revalidateTag('global_careers-settings_fr', 'max')
        revalidateTag('global_careers-settings_en', 'max')
      },
    ],
  },
  fields: [
    {
      name: 'list',
      type: 'group',
      label: 'Page « Carrières » (liste)',
      fields: [
        txt('eyebrow', 'Accroche', 'Défaut : « Carrières ».'),
        txt('title', 'Titre', 'Défaut : « Construisons ensemble ».'),
        area('intro', 'Introduction'),
        txt('emptyText', 'Message « aucune offre »', 'Affiché quand il n’y a aucune offre publiée.'),
        txt('spontaneousCta', 'Libellé « candidature spontanée »'),
      ],
    },
    {
      name: 'spontaneous',
      type: 'group',
      label: 'Page « Candidature spontanée »',
      fields: [
        txt('eyebrow', 'Accroche'),
        txt('title', 'Titre', 'Défaut : « Parlez-nous de vous ».'),
        area('intro', 'Introduction'),
        txt('lookForHeading', 'Titre « ce qu’on regarde »'),
        {
          name: 'lookFor',
          type: 'array',
          localized: true,
          label: 'Points « ce qu’on regarde »',
          admin: { initCollapsed: true },
          fields: [{ name: 'text', type: 'text' }],
        },
        txt('nextHeading', 'Titre « et après »'),
        area('nextText', 'Texte « et après »'),
      ],
    },
    {
      name: 'detail',
      type: 'group',
      label: 'Page d’une offre (en-têtes)',
      fields: [
        txt('responsibilities', 'Titre « Responsabilités »'),
        txt('requirements', 'Titre « Prérequis »'),
        txt('perks', 'Titre « Avantages »'),
      ],
    },
    {
      name: 'form',
      type: 'group',
      label: 'Formulaire de candidature',
      fields: [
        txt('title', 'Titre du formulaire', 'Défaut : « Postuler ».'),
        txt('firstName', 'Libellé « Prénom »'),
        txt('lastName', 'Libellé « Nom »'),
        txt('email', 'Libellé « Email »'),
        txt('phone', 'Libellé « Téléphone »'),
        txt('linkedin', 'Libellé « LinkedIn »'),
        txt('portfolio', 'Libellé « Portfolio »'),
        txt('coverLetter', 'Libellé « Lettre de motivation »'),
        txt('cv', 'Libellé « CV »'),
        area('consent', 'Texte de consentement'),
        txt('submit', 'Bouton d’envoi'),
        txt('successTitle', 'Titre de confirmation'),
        area('successBody', 'Message de confirmation'),
      ],
    },
  ],
}
