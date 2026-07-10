import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'

// Éditeur riche pour les emails newsletter : reprend les fonctionnalités par défaut
// du projet (titres, gras/italique, liens, listes) et ajoute l'upload d'images.
export const newsletterEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    UploadFeature({ collections: { media: { fields: [] } } }),
  ],
})
