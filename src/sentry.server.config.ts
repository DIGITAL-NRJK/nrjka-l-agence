import * as Sentry from '@sentry/nextjs'

// Suivi d'erreurs côté serveur, envoyé à GlitchTip (auto-hébergé, données en Europe).
// Actif uniquement si NEXT_PUBLIC_SENTRY_DSN est défini (sinon le SDK est un no-op).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Traces à faible échantillonnage en prod (GlitchTip = priorité aux erreurs).
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
  // RGPD : ne pas transmettre d'informations personnelles ni de corps de requête.
  sendDefaultPii: false,
})
