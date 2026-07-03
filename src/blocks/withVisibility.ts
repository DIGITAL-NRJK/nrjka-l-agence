import type { Block } from 'payload'

import { hiddenField } from '@/fields/visibility'

// Ajoute à un bloc la possibilité d'être masqué du site public sans être supprimé :
//   - champ « hidden » en tête du bloc (case à cocher) ;
//   - étiquette de ligne personnalisée qui affiche « masqué » quand c'est le cas.
// Appliqué à tous les blocs de page en une seule fois dans Pages/index.ts, donc
// tout bloc ajouté plus tard en hérite automatiquement.
export const withVisibility = (block: Block): Block => ({
  ...block,
  fields: [hiddenField, ...block.fields],
  admin: {
    ...block.admin,
    components: {
      ...block.admin?.components,
      Label: '@/components/admin/BlockRowLabel#BlockRowLabel',
    },
  },
})
