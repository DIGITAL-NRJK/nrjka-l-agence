declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      URL: string
      DEPLOY_PRIME_URL: string
      NEXT_PUBLIC_UMAMI_WEBSITE_ID: string
      NEXT_PUBLIC_UMAMI_SCRIPT_URL: string
    }
  }

  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void
    }
  }
}

export {}
