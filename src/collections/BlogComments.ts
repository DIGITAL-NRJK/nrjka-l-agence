import type { CollectionConfig } from 'payload'
import { publicRead, editorOrAdmin, adminOnly } from '../access'

export const BlogComments: CollectionConfig = {
  slug: 'blog-comments',
  labels: { singular: 'Commentaire', plural: 'Commentaires de blog' },
  admin: {
    useAsTitle: 'author_name',
    defaultColumns: ['author_name', 'blog_post', 'status', 'createdAt'],
    group: 'Contenu',
  },
  access: {
    read: publicRead,
    create: publicRead, // Les visiteurs peuvent commenter
    update: editorOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: 'author_name', type: 'text', required: true, label: "Nom de l'auteur" },
    { name: 'author_email', type: 'email', required: true, label: "Email de l'auteur" },
    { name: 'content', type: 'textarea', required: true, label: 'Commentaire' },
    {
      name: 'blog_post',
      type: 'relationship',
      relationTo: 'posts', // Le template Payload utilise 'posts' pour les articles
      required: true,
      label: 'Article commenté',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Approuvé', value: 'approved' },
        { label: 'Rejeté', value: 'rejected' },
      ],
    },
  ],
}
