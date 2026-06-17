import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contact',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true },
    {
      name: 'titleAccent',
      type: 'text',
      localized: true,
      admin: { description: 'Dernier mot du titre, affiché en terracotta (ex. « projet. »).' },
    },
    { name: 'subtitle', type: 'textarea', localized: true },
    {
      name: 'stepsHeading',
      type: 'text',
      localized: true,
      admin: { description: 'Titre de la colonne gauche (ex. « Ce qui se passe ensuite »).' },
    },
    {
      name: 'steps',
      type: 'array',
      localized: true,
      maxRows: 4,
      admin: { description: 'Les étapes après l’envoi. Laisser vide = valeurs par défaut.' },
      fields: [
        {
          name: 'icon',
          type: 'text',
          defaultValue: 'messageSquare',
          admin: {
            description:
              'Icône : messageSquare, clock, shieldCheck, mail, phone, calendar, fileText ou sparkles.',
          },
        },
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'emailIntro',
      type: 'text',
      localized: true,
      admin: { description: 'Phrase au-dessus de l’email de repli.' },
    },
    {
      name: 'email',
      type: 'text',
      admin: { description: 'Adresse email de repli affichée et cliquable.' },
    },
    appearance,
  ],
}
