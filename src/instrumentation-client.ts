import * as Sentry from '@sentry/nextjs'

// Suivi d'erreurs côté navigateur → GlitchTip.
// ⚠️ GlitchTip ne gère PAS Session Replay, User Feedback ni les Logs Sentry :
// ces intégrations ne sont donc volontairement pas activées.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
  sendDefaultPii: false,
})

// Instrumente les navigations du routeur (App Router).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
