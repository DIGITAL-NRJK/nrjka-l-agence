import * as Sentry from '@sentry/nextjs'

// Runtime « edge » (utilisé notamment par le middleware i18n). Mêmes réglages que le serveur.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
  sendDefaultPii: false,
})
