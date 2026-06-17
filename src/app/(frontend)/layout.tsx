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
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, bricolage.variable)} lang="fr" suppressHydrationWarning>
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
                'Agence web spécialisée en transformation digitale, création de sites, SEO et automatisation. Architecture D4™ — de la complexité à la clarté.',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['French', 'English'],
              },
            }),
          }}
        />
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          <main id="main">{children}</main>
          <Footer />
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

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
