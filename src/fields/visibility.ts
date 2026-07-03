import type { Field } from 'payload'

// Champ « Masquer » partagé par tous les blocs de page (injecté via withVisibility).
// Non localisé : masquer une section vaut pour toutes les langues.
export const hiddenField: Field = {
  name: 'hidden',
  type: 'checkbox',
  label: 'Masquer cette section sur le site',
  defaultValue: false,
  admin: {
    description:
      'Cochez pour retirer la section du site public. Elle reste ici, modifiable, et repérée « masqué ».',
  },
}
