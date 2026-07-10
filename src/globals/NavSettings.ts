import type { GlobalConfig } from 'payload'
import { authenticatedRead } from '../access'

/**
 * Ordre du menu de gauche de l'admin, pilotable sans toucher au code.
 * La liste « order » définit l'ordre des entrées ; l'ordre des groupes
 * découle de la première apparition d'une de leurs entrées.
 * Les entrées non listées gardent leur ordre par défaut, à la fin.
 * Consommé par le composant Nav personnalisé (src/components/admin/Nav.tsx).
 */
export const NavSettings: GlobalConfig = {
  slug: 'nav-settings',
  label: 'Menu (ordre)',
  admin: {
    group: 'Paramètres',
    description:
      'Ordre du menu de gauche. Glissez les lignes pour réordonner. Regroupez les entrées d’un même groupe pour ordonner les groupes entre eux. Les entrées non listées apparaissent à la fin, dans l’ordre par défaut. (Les groupes de « globals » comme Paramètres restent sous les collections.)',
  },
  access: {
    read: authenticatedRead,
  },
  fields: [
    {
      name: 'order',
      type: 'array',
      label: 'Ordre des entrées',
      admin: {
        initCollapsed: false,
        components: {
          RowLabel: '@/globals/NavSettingsRowLabel#NavSettingsRowLabel',
        },
      },
      fields: [
        {
          name: 'entity',
          type: 'select',
          required: true,
          label: 'Entrée',
          options: [
            // Contenu
            { label: 'Pages', value: 'pages' },
            { label: 'Articles (blog)', value: 'posts' },
            { label: 'Catégories', value: 'categories' },
            { label: 'Pôles & Expertises', value: 'expertises' },
            { label: 'Services', value: 'services' },
            { label: 'Études de cas', value: 'case-studies' },
            { label: 'Secteurs', value: 'case-study-sectors' },
            { label: 'Types de projet', value: 'case-study-types' },
            { label: 'Témoignages', value: 'testimonials' },
            { label: 'Avis', value: 'reviews' },
            { label: 'Commentaires de blog', value: 'blog-comments' },
            { label: 'Ressources', value: 'resources' },
            { label: 'Médias', value: 'media' },
            // E-commerce
            { label: 'Produits', value: 'products' },
            // CRM
            { label: 'Messages de contact', value: 'contact-messages' },
            { label: 'Rendez-vous', value: 'appointments' },
            // RH
            { label: 'Offres d’emploi', value: 'job-offers' },
            { label: 'Candidatures', value: 'job-applications' },
            // Marketing
            { label: 'Pop-ups', value: 'popups' },
            { label: 'Abonnés (newsletter)', value: 'newsletter-subscribers' },
            { label: 'Signatures (newsletter)', value: 'newsletter-signatures' },
            { label: 'Campagnes (newsletter)', value: 'newsletter-campaigns' },
            // IA
            { label: 'Base de connaissances (IA)', value: 'knowledge-chunks' },
            { label: 'Conversations (chatbot)', value: 'chat-conversations' },
            // Système / utilisateurs
            { label: 'Utilisateurs', value: 'users' },
            { label: 'Redirections', value: 'redirects' },
            { label: 'Formulaires', value: 'forms' },
            { label: 'Soumissions de formulaire', value: 'form-submissions' },
            // Globals
            { label: '⚙︎ Header', value: 'header' },
            { label: '⚙︎ Footer', value: 'footer' },
            { label: '⚙︎ Paramètres du site', value: 'site-settings' },
            { label: '⚙︎ Carrières (textes)', value: 'careers-settings' },
            { label: '⚙︎ Menu (ordre)', value: 'nav-settings' },
          ],
        },
      ],
    },
  ],
}
