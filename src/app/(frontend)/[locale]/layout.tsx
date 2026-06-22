import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Bricolage_Grotesque } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { MaintenancePage } from '@/components/MaintenancePage'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { isValidLocale, DEFAULT_LOCALE } from '@/utilities/i18n'
import { getCachedGlobal } from '@/utilities/getGlobals'

import '../globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { isEnabled } = await draftMode()
  const { locale: rawLocale } = await params
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE

  // Maintenance / coming soon check — skip for draft/preview mode
  let maintenanceActive = false
  let maintenanceMode: 'maintenance' | 'coming_soon' = 'maintenance'
  let maintenanceTitle = locale === 'en' ? 'Site under maintenance' : 'Site en maintenance'
  let maintenanceMessage =
    locale === 'en'
      ? 'We are performing maintenance. Check back soon.'
      : 'Nous effectuons une maintenance. Revenez bientôt.'
  let countdownDate: string | null = null

  if (!isEnabled) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const siteSettings = await getCachedGlobal('site-settings' as any, 1, locale)()
      const mm = (siteSettings as unknown as Record<string, unknown>)?.maintenanceMode as
        | Record<string, unknown>
        | undefined
      if (mm?.enabled) {
        maintenanceActive = true
        maintenanceMode = (mm.mode as 'maintenance' | 'coming_soon') || 'maintenance'
        maintenanceTitle = (mm.title as string) || maintenanceTitle
        maintenanceMessage = (mm.message as string) || maintenanceMessage
        countdownDate = (mm.countdownDate as string) || null
      }
    } catch {
      // Silently fail — site-settings global may not exist yet (needs migration)
    }
  }

  if (maintenanceActive) {
    return (
      <html
        className={cn(GeistSans.variable, GeistMono.variable, bricolage.variable)}
        lang={locale}
        suppressHydrationWarning
      >
        <head>
          <InitTheme />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        </head>
        <body>
          <Providers>
            <MaintenancePage
              mode={maintenanceMode}
              title={maintenanceTitle}
              message={maintenanceMessage}
              countdownDate={countdownDate}
              locale={locale}
            />
          </Providers>
        </body>
      </html>
    )
  }

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, bricolage.variable)}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'NRJKA Digital',
              url: getServerSideURL(),
              logo: `${getServerSideURL()}/favicon.svg`,
              description:
                locale === 'en'
                  ? 'Web agency specializing in digital transformation, website creation, SEO and automation. D4™ Architecture — from complexity to clarity.'
                  : 'Agence web spécialisée en transformation digitale, création de sites, SEO et automatisation. Architecture D4™ — de la complexité à la clarté.',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['French', 'English'],
              },
            }),
          }}
        />
        <a href="#main" className="skip-link">
          {locale === 'en' ? 'Skip to content' : 'Aller au contenu'}
        </a>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <AccessibilityWidget />
        </Providers>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
