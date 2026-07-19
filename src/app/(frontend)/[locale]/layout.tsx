import type { Metadata } from 'next'
import type { SiteSetting } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Bricolage_Grotesque } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { ChatWidget } from '@/components/ChatWidget'
import { PopupManager } from '@/components/PopupManager'
import { getActivePopups } from '@/utilities/getPopups'
import { ConsentManager } from '@/components/Consent/ConsentManager'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { MaintenancePage } from '@/components/MaintenancePage'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { isValidLocale, DEFAULT_LOCALE } from '@/utilities/i18n'
import { englishEnabledFrom } from '@/utilities/languages'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { resolvePalette } from '@/utilities/palettes'

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

// Données structurées Organization (schema.org) alimentées par les Paramètres du site.
// Les champs vides sont omis ; replis honnêtes si le global n'existe pas encore.
function buildOrganizationJsonLd(settings: SiteSetting | null, locale: string) {
  const seo = settings?.seo
  const social = settings?.social
  const contact = settings?.contact
  const serverUrl = getServerSideURL()

  const sameAs = social
    ? [
        social.linkedin,
        social.instagram,
        social.facebook,
        social.twitter,
        social.youtube,
        social.tiktok,
      ].filter((u): u is string => Boolean(u))
    : []

  const hasAddress = Boolean(
    contact?.addressLine || contact?.postalCode || contact?.city || contact?.country,
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seo?.siteName?.trim() || 'NRJKA Digital',
    url: serverUrl,
    logo: `${serverUrl}/favicon.svg`,
    description:
      seo?.defaultMetaDescription?.trim() ||
      (locale === 'en'
        ? 'Web agency specializing in digital transformation, website creation, SEO and automation. D4™ Architecture — from complexity to clarity.'
        : 'Agence web spécialisée en transformation digitale, création de sites, SEO et automatisation. Architecture D4™ — de la complexité à la clarté.'),
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['French', 'English'],
      ...(contact?.email ? { email: contact.email } : {}),
      ...(contact?.phone ? { telephone: contact.phone } : {}),
    },
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(contact?.addressLine ? { streetAddress: contact.addressLine } : {}),
            ...(contact?.postalCode ? { postalCode: contact.postalCode } : {}),
            ...(contact?.city ? { addressLocality: contact.city } : {}),
            ...(contact?.country ? { addressCountry: contact.country } : {}),
          },
        }
      : {}),
  }
}

// Données structurées WebSite + SearchAction (boîte de recherche sitelinks Google).
function buildWebsiteJsonLd(settings: SiteSetting | null, locale: string) {
  const serverUrl = getServerSideURL()
  const siteName = settings?.seo?.siteName?.trim() || 'NRJKA Digital'
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: `${serverUrl}/${locale}`,
    inLanguage: locale === 'en' ? 'en' : 'fr',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${serverUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { isEnabled } = await draftMode()
  const { locale: rawLocale } = await params
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE

  // Paramètres du site (SEO, social, coordonnées, maintenance). Repli null géré par getSiteSettings.
  const settings = await getSiteSettings(locale)

  // Version anglaise désactivable (Paramètres › Langues) : tout /en/* redirige vers
  // l'accueil FR. Volontairement TEMPORAIRE (307 via redirect()) — état réversible,
  // on ne grave aucun signal permanent. La prévisualisation admin reste accessible.
  if (locale === 'en' && !isEnabled && !englishEnabledFrom(settings)) {
    redirect(`/${DEFAULT_LOCALE}`)
  }

  // Palette de couleurs (Paramètres › Apparence) — posée en SSR sur <html>, zéro flash.
  // Le mode clair/sombre reste au visiteur (data-theme via InitTheme).
  const palette = resolvePalette(
    (settings as { appearance?: { colorScheme?: string } } | null)?.appearance?.colorScheme,
  )

  // Maintenance / coming soon check — skip for draft/preview mode
  let maintenanceActive = false
  let maintenanceMode: 'maintenance' | 'coming_soon' = 'maintenance'
  let maintenanceTitle = locale === 'en' ? 'Site under maintenance' : 'Site en maintenance'
  let maintenanceMessage =
    locale === 'en'
      ? 'We are performing maintenance. Check back soon.'
      : 'Nous effectuons une maintenance. Revenez bientôt.'
  let countdownDate: string | null = null
  let maintenanceTemplate: 'minimal' | 'countdown' | 'image' | 'notify' = 'minimal'
  let maintenanceBg: string | null = null
  let maintenanceNotifyConfirm: string | null = null

  if (!isEnabled) {
    const mm = settings?.maintenanceMode as
      | (NonNullable<typeof settings>['maintenanceMode'] & {
          template?: 'minimal' | 'countdown' | 'image' | 'notify' | null
          backgroundImage?: { url?: string | null } | number | null
          notifyConfirmation?: string | null
        })
      | undefined
    if (mm?.enabled) {
      maintenanceActive = true
      maintenanceMode = mm.mode || 'maintenance'
      maintenanceTitle = mm.title || maintenanceTitle
      maintenanceMessage = mm.message || maintenanceMessage
      countdownDate = mm.countdownDate || null
      maintenanceTemplate = mm.template || 'minimal'
      maintenanceBg =
        mm.backgroundImage && typeof mm.backgroundImage === 'object'
          ? mm.backgroundImage.url || null
          : null
      maintenanceNotifyConfirm = mm.notifyConfirmation || null
    }
  }

  if (maintenanceActive) {
    return (
      <html
        className={cn(GeistSans.variable, GeistMono.variable, bricolage.variable)}
        data-palette={palette}
        lang={locale}
        suppressHydrationWarning
      >
        <head>
          <InitTheme />
          {/* Anti-flash : html{opacity:0} attend le script de thème — si JS est coupé, on réaffiche. */}
          <noscript>
            <style>{'html{opacity:1}'}</style>
          </noscript>
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
              template={maintenanceTemplate}
              backgroundImageUrl={maintenanceBg}
              notifyConfirmation={maintenanceNotifyConfirm}
              locale={locale}
            />
          </Providers>
        </body>
      </html>
    )
  }

  const activePopups = await getActivePopups(locale)

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, bricolage.variable)}
      data-palette={palette}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {/* Anti-flash : html{opacity:0} attend le script de thème — si JS est coupé, on réaffiche. */}
        <noscript>
          <style>{'html{opacity:1}'}</style>
        </noscript>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={locale === 'en' ? 'NRJKA — Blog' : 'NRJKA — Le blog'}
          href={`/${locale}/rss.xml`}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd(settings, locale)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteJsonLd(settings, locale)) }}
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
          {Boolean(
            process.env.AI_API_KEY || process.env.MISTRAL_API_KEY || process.env.AI_BASE_URL,
          ) && <ChatWidget locale={locale} />}
          {activePopups.length > 0 && <PopupManager popups={activePopups} locale={locale} />}
        </Providers>
        {/* Mesure d'audience : chargée UNIQUEMENT après consentement (voir ConsentManager). */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <ConsentManager
            locale={locale}
            umamiSrc={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            umamiWebsiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const settings = await getSiteSettings(locale)

  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
    },
    // Interrupteur global : « Empêcher l'indexation » dans les Paramètres du site.
    // Hérité par toutes les pages qui ne définissent pas leur propre robots.
    ...(settings?.seo?.noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
