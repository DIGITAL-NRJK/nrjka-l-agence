'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

/**
 * Gestion du consentement RGPD + chargement conditionnel d'Umami.
 *
 * Choix produit (validé) : la mesure d'audience ne se charge QU'APRÈS un accord
 * explicite. Le script Umami est injecté seulement si `analytics === true`.
 *
 * - Le choix est stocké en localStorage (pas de cookie) → pas de bandeau au 2ᵉ passage.
 * - Le bouton « Gérer mes préférences » (footer) rouvre le bandeau via l'événement
 *   `nrjka:open-consent`.
 * - Retrait du consentement : on efface le choix et on recharge pour décharger Umami.
 */

const STORAGE_KEY = 'nrjka-consent-v1'
const UMAMI_SCRIPT_ID = 'umami-analytics'
export const OPEN_CONSENT_EVENT = 'nrjka:open-consent'

type Consent = { analytics: boolean; ts: number }

type Props = {
  locale: string
  umamiSrc?: string
  umamiWebsiteId?: string
}

const COPY = {
  fr: {
    title: 'Votre vie privée',
    body: 'Nous utilisons une mesure d’audience respectueuse (Umami, sans publicité ni revente de données) pour améliorer le site. Elle ne se charge qu’avec votre accord.',
    privacy: 'Politique de confidentialité',
    accept: 'Tout accepter',
    reject: 'Refuser',
    customize: 'Personnaliser',
    save: 'Enregistrer mes choix',
    necessary: 'Strictement nécessaire',
    necessaryDesc: 'Indispensable au fonctionnement du site. Toujours actif.',
    analytics: 'Mesure d’audience',
    analyticsDesc: 'Statistiques de visite anonymes (Umami).',
    always: 'Toujours actif',
  },
  en: {
    title: 'Your privacy',
    body: 'We use privacy-friendly analytics (Umami — no ads, no data resale) to improve the site. It only loads with your consent.',
    privacy: 'Privacy policy',
    accept: 'Accept all',
    reject: 'Decline',
    customize: 'Customize',
    save: 'Save my choices',
    necessary: 'Strictly necessary',
    necessaryDesc: 'Required for the site to work. Always on.',
    analytics: 'Audience measurement',
    analyticsDesc: 'Anonymous visit statistics (Umami).',
    always: 'Always on',
  },
} as const

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Consent
    if (typeof parsed?.analytics !== 'boolean') return null
    return parsed
  } catch {
    return null
  }
}

export const ConsentManager: React.FC<Props> = ({ locale, umamiSrc, umamiWebsiteId }) => {
  const t = COPY[locale === 'en' ? 'en' : 'fr']
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analyticsChecked, setAnalyticsChecked] = useState(true)
  const [consent, setConsentState] = useState<Consent | null>(null)

  // Injection Umami (idempotente) quand la mesure est consentie.
  const loadUmami = useCallback(() => {
    if (!umamiSrc || !umamiWebsiteId) return
    if (document.getElementById(UMAMI_SCRIPT_ID)) return
    const s = document.createElement('script')
    s.id = UMAMI_SCRIPT_ID
    s.src = umamiSrc
    s.defer = true
    s.setAttribute('data-website-id', umamiWebsiteId)
    document.head.appendChild(s)
  }, [umamiSrc, umamiWebsiteId])

  // Au montage : lire le choix existant. Aucun choix → afficher le bandeau.
  useEffect(() => {
    setMounted(true)
    const existing = readConsent()
    setConsentState(existing)
    if (!existing) {
      setOpen(true)
    } else {
      setAnalyticsChecked(existing.analytics)
      if (existing.analytics) loadUmami()
    }
  }, [loadUmami])

  // Réouverture depuis le footer (« Gérer mes préférences »).
  useEffect(() => {
    const handler = () => {
      const existing = readConsent()
      setAnalyticsChecked(existing?.analytics ?? true)
      setShowDetails(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_CONSENT_EVENT, handler)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, handler)
  }, [])

  const persist = useCallback(
    (analytics: boolean) => {
      const prev = consent
      const next: Consent = { analytics, ts: Date.now() }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* stockage indisponible : on continue sans persistance */
      }
      setConsentState(next)
      setOpen(false)
      setShowDetails(false)

      if (analytics) {
        loadUmami()
      } else if (prev?.analytics) {
        // Retrait d'un consentement déjà accordé → recharger pour décharger Umami.
        window.location.reload()
      }
    },
    [consent, loadUmami],
  )

  if (!mounted || !open) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.title}
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-5 shadow-soft sm:p-6">
        <div className="text-base font-semibold text-ink">{t.title}</div>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          {t.body}{' '}
          <Link
            href={`/${locale}/confidentialite`}
            className="font-medium text-terracotta-dark underline underline-offset-2 hover:text-terracotta"
          >
            {t.privacy}
          </Link>
          .
        </p>

        {showDetails && (
          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4 rounded-xl bg-card px-4 py-3">
              <div>
                <div className="text-sm font-medium text-ink">{t.necessary}</div>
                <div className="text-xs text-slate">{t.necessaryDesc}</div>
              </div>
              <span className="mt-0.5 shrink-0 text-xs font-medium text-slate">{t.always}</span>
            </div>
            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl bg-card px-4 py-3">
              <div>
                <div className="text-sm font-medium text-ink">{t.analytics}</div>
                <div className="text-xs text-slate">{t.analyticsDesc}</div>
              </div>
              <input
                type="checkbox"
                checked={analyticsChecked}
                onChange={(e) => setAnalyticsChecked(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-terracotta"
              />
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="order-3 rounded-full px-4 py-2 text-sm font-medium text-slate transition-colors hover:text-ink sm:order-1"
            >
              {t.customize}
            </button>
          )}
          <button
            type="button"
            onClick={() => persist(false)}
            className="order-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-card"
          >
            {t.reject}
          </button>
          {showDetails ? (
            <button
              type="button"
              onClick={() => persist(analyticsChecked)}
              className="order-1 rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark sm:order-3"
            >
              {t.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => persist(true)}
              className="order-1 rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark sm:order-3"
            >
              {t.accept}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsentManager
