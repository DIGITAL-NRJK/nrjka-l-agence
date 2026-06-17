import type { CollectionConfig } from 'payload'
import { authenticatedRead, publicRead, adminOnly } from '../access'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: { singular: 'Candidature', plural: 'Candidatures' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['first_name', 'last_name', 'email', 'job_offer', 'status', 'createdAt'],
    group: 'RH',
    description:
      'Les candidatures reçues via le formulaire de recrutement. Suivez leur statut ici (créées automatiquement, non modifiables par le public).',
  },
  access: {
    read: authenticatedRead,
    create: publicRead, // Les visiteurs peuvent candidater
    update: authenticatedRead,
    delete: adminOnly,
  },
  fields: [
    { name: 'first_name', type: 'text', required: true, label: 'Prénom' },
    { name: 'last_name', type: 'text', required: true, label: 'Nom' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'linkedin_url', type: 'text', label: 'Profil LinkedIn' },
    { name: 'portfolio_url', type: 'text', label: 'Portfolio / Site web' },
    { name: 'cover_letter', type: 'textarea', label: 'Lettre de motivation' },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      label: 'CV (fichier)',
    },
    {
      name: 'job_offer',
      type: 'relationship',
      relationTo: 'job-offers',
      label: 'Offre concernée',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Nouvelle', value: 'new' },
        { label: 'En cours de lecture', value: 'reviewing' },
        { label: 'Entretien planifié', value: 'interview' },
        { label: 'Retenue', value: 'accepted' },
        { label: 'Refusée', value: 'rejected' },
      ],
    },
    {
      name: 'internal_notes',
      type: 'textarea',
      label: 'Notes internes',
      admin: { position: 'sidebar' },
    },
  ],
}
