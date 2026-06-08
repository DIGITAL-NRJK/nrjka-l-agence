import type { CollectionConfig } from 'payload'
import { authenticatedRead, publicRead, adminOnly } from '../access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message', plural: 'Messages de contact' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'type', 'status', 'createdAt'],
    group: 'CRM',
  },
  access: {
    // Le formulaire public peut créer (pas besoin d'être connecté)
    read: authenticatedRead,
    create: publicRead,
    update: authenticatedRead,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nom' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'company', type: 'text', label: 'Entreprise' },
    { name: 'message', type: 'textarea', required: true, label: 'Message' },
    {
      name: 'type',
      type: 'select',
      label: 'Type',
      defaultValue: 'general',
      options: [
        { label: 'Général', value: 'general' },
        { label: 'Devis', value: 'quote' },
        { label: 'Support', value: 'support' },
        { label: 'Partenariat', value: 'partnership' },
      ],
    },
    { name: 'context', type: 'text', label: 'Contexte' },
    {
      name: 'source_tool',
      type: 'text',
      label: 'Source (outil)',
      admin: { description: 'quiz, contact, newsletter...' },
    },
    { name: 'service_type', type: 'text', label: 'Type de service demandé' },
    {
      name: 'services_needed',
      type: 'array',
      label: 'Services demandés',
      fields: [{ name: 'service', type: 'text' }],
    },
    { name: 'budget', type: 'text', label: 'Budget' },
    {
      name: 'priorities',
      type: 'array',
      label: 'Priorités',
      fields: [{ name: 'priority', type: 'text' }],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Lu', value: 'reading' },
        { label: 'En cours', value: 'in-progress' },
        { label: 'Répondu', value: 'answered' },
        { label: 'Archivé', value: 'archived' },
      ],
    },
    {
      name: 'has_appointment',
      type: 'checkbox',
      defaultValue: false,
      label: 'A un RDV',
      admin: { position: 'sidebar' },
    },
    { name: 'appointment_id', type: 'text', label: 'ID du RDV', admin: { position: 'sidebar' } },
    {
      name: 'notion_id',
      type: 'text',
      label: 'ID Notion',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
