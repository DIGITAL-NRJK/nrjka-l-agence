/**
 * Petit utilitaire de tracking d'événements Umami.
 *
 * `track()` est un no-op tant qu'Umami n'est pas chargé : le script n'est injecté
 * qu'APRÈS consentement (voir ConsentManager). Donc si le visiteur a refusé la
 * mesure d'audience, `window.umami` est absent et aucun événement n'est envoyé.
 *
 * Usage : track('demande_audit_submit', { source: 'hero' })
 */
export type TrackData = Record<string, string | number | boolean>

export function track(event: string, data?: TrackData): void {
  if (typeof window === 'undefined') return
  try {
    window.umami?.track(event, data)
  } catch {
    // silencieux : la mesure ne doit jamais casser l'expérience
  }
}

/** Événements de conversion standard du site (source unique de vérité pour éviter les fautes de frappe). */
export const CONVERSIONS = {
  contactSubmit: 'contact_form_submit',
  auditRequest: 'demande_audit_submit',
  appointmentBooked: 'rdv_reserve',
  resourceDownload: 'ressource_telechargee',
  resourceLead: 'ressource_lead',
  jobApplication: 'candidature_soumise',
  newsletterSignup: 'newsletter_inscription',
  ctaPrimaryClick: 'cta_principal_clic',
} as const
