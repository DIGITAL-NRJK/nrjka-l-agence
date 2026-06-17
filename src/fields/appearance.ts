import type { Field } from 'payload'

export const appearance: Field = {
  name: 'appearance',
  label: 'Apparence',
  type: 'group',
  admin: {
    description:
      "Personnalisation visuelle de la section. Tout champ laissé vide ou « Par défaut » conserve le design d'origine.",
  },
  fields: [
    {
      name: 'titleSize',
      label: 'Taille du titre',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Par défaut', value: 'default' },
        { label: 'Petit', value: 'sm' },
        { label: 'Moyen', value: 'md' },
        { label: 'Grand', value: 'lg' },
        { label: 'Très grand', value: 'xl' },
      ],
    },
    {
      name: 'textSize',
      label: 'Taille du texte',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Par défaut', value: 'default' },
        { label: 'Petit', value: 'sm' },
        { label: 'Normal', value: 'base' },
        { label: 'Grand', value: 'lg' },
      ],
    },
    {
      name: 'titleColor',
      label: 'Couleur du titre (code hex, ex. #1F2A44)',
      type: 'text',
    },
    {
      name: 'textColor',
      label: 'Couleur du texte (code hex)',
      type: 'text',
    },
    {
      name: 'background',
      label: 'Couleur de fond (code hex)',
      type: 'text',
    },
  ],
}
