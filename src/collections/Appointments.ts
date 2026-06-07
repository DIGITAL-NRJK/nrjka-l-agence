import type { CollectionConfig } from 'payload'
import { authenticatedRead, publicRead, adminOnly } from '../access'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: { singular: 'Rendez-vous', plural: 'Rendez-vous' },
  admin: {
    useAsTitle: 'client_name',
    defaultColumns: ['client_name', 'client_email', 'appointment_date', 'status', 'createdAt'],
    group: 'CRM',
  },
  access: {
    read: authenticatedRead,
    create: publicRead, // Le formulaire public peut créer
    update: authenticatedRead,
    delete: adminOnly,
  },
  fields: [
    { name: 'client_name', type: 'text', required: true, label: 'Nom du client' },
    { name: 'client_email', type: 'email', required: true, label: 'Email' },
    { name: 'client_phone', type: 'text', label: 'Téléphone' },
    { name: 'company', type: 'text', label: 'Entreprise' },
    {
      name: 'appointment_date',
      type: 'date',
      required: true,
      label: 'Date et heure du RDV',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'source_tool',
      type: 'text',
      label: 'Source',
      admin: { description: 'quiz, contact, page service...' },
    },
    {
      name: 'priorities',
      type: 'array',
      label: 'Priorités du projet',
      fields: [{ name: 'priority', type: 'text' }],
    },
    { name: 'project_summary', type: 'textarea', label: 'Résumé du projet' },
    { name: 'notes', type: 'textarea', label: 'Notes' },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'scheduled',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Planifié', value: 'scheduled' },
        { label: 'Confirmé', value: 'confirmed' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'cancelled' },
        { label: 'Reporté', value: 'rescheduled' },
      ],
    },
  ],
}
