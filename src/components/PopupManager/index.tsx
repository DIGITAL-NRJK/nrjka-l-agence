'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

import type { PopupData } from '@/utilities/getPopups'

const storageKey = (id: string) => `nrjka_popup_${id}`

function alreadyShown(p: PopupData): boolean {
  if (typeof window === 'undefined') return false
  if (p.frequency === 'always') return false
  try {
    const store = p.frequency === 'once' ? window.localStorage : window.sessionStorage
    return store.getItem(storageKey(p.id)) === '1'
  } catch {
    return false
  }
}

function markShown(p: PopupData) {
  if (typeof window === 'undefined' || p.frequency === 'always') return
  try {
    const store = p.frequency === 'once' ? window.localStorage : window.sessionStorage
    store.setItem(storageKey(p.id), '1')
  } catch {
    /* stockage indisponible : on ignore */
  }
}

/** `base` = chemin sans le préfixe de langue, ex. « /fr/contact » → « /contact ». */
function matchesPath(p: PopupData, base: string): boolean {
  if (p.showOn === 'all') return true
  const hit = p.paths.some((entry) => {
    const e = (entry.startsWith('/') ? entry : `/${entry}`).replace(/\/+$/, '') || '/'
    return base === e || base.startsWith(e === '/' ? '/' : `${e}/`)
  })
  return p.showOn === 'include' ? hit : !hit
}

// ─── Templates ──────────────────────────────────────────────────────────────

const CloseButton: React.FC<{ onClose: () => void; label: string; tone?: 'light' | 'dark' }> = ({
  onClose,
  label,
  tone = 'light',
}) => (
  <button
    type="button"
    onClick={onClose}
    aria-label={label}
    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
      tone === 'dark'
        ? 'text-white/70 hover:bg-white/10 hover:text-white'
        : 'text-slate hover:bg-surface-soft hover:text-ink'
    }`}
  >
    <X className="h-4 w-4" strokeWidth={2.2} />
  </button>
)

const Cta: React.FC<{ popup: PopupData; onClose: () => void; variant: 'solid' | 'onDark' }> = ({
  popup,
  onClose,
  variant,
}) => {
  if (!popup.ctaLabel || !popup.ctaUrl) return null
  const cls =
    variant === 'onDark'
      ? 'bg-white text-brand hover:bg-white/90'
      : 'bg-terracotta text-terracotta-foreground hover:bg-terracotta-dark'
  return (
    <a
      href={popup.ctaUrl}
      onClick={() => onClose()}
      className={`inline-flex h-11 shrink-0 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${cls}`}
    >
      {popup.ctaLabel}
    </a>
  )
}

const PopupView: React.FC<{ popup: PopupData; locale: string; onClose: () => void }> = ({
  popup,
  locale,
  onClose,
}) => {
  const en = locale === 'en'
  const closeLabel = en ? 'Close' : 'Fermer'

  // Barre haute : décale le header (variable CSS) + réserve l'espace en haut du body.
  useEffect(() => {
    if (popup.template !== 'top-bar') return
    const root = document.documentElement
    const prevOffset = root.style.getPropertyValue('--promo-offset')
    const prevPad = document.body.style.paddingTop
    root.style.setProperty('--promo-offset', '2.75rem')
    document.body.style.paddingTop = '2.75rem'
    return () => {
      root.style.setProperty('--promo-offset', prevOffset)
      document.body.style.paddingTop = prevPad
    }
  }, [popup.template])

  // ── Modale centrée ──
  if (popup.template === 'modal') {
    return (
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={popup.heading || 'Message'}
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />
        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          {popup.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={popup.imageUrl} alt="" className="h-40 w-full object-cover" />
          )}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              {popup.heading && (
                <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                  {popup.heading}
                </h2>
              )}
              {popup.dismissible && <CloseButton onClose={onClose} label={closeLabel} />}
            </div>
            {popup.body && <p className="mt-3 text-sm leading-relaxed text-slate">{popup.body}</p>}
            {popup.ctaLabel && popup.ctaUrl && (
              <div className="mt-6">
                <Cta popup={popup} onClose={onClose} variant="solid" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Slide-in (coin bas-droit) ──
  if (popup.template === 'slide-in') {
    return (
      <div className="fixed bottom-4 right-4 z-[90] w-[calc(100vw-2rem)] max-w-sm animate-[slideUp_.3s_ease-out] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:bottom-6 sm:right-6">
        {popup.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={popup.imageUrl} alt="" className="h-32 w-full object-cover" />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            {popup.heading && (
              <h2 className="font-display text-base font-bold tracking-tight text-ink">
                {popup.heading}
              </h2>
            )}
            {popup.dismissible && <CloseButton onClose={onClose} label={closeLabel} />}
          </div>
          {popup.body && <p className="mt-2 text-sm leading-relaxed text-slate">{popup.body}</p>}
          {popup.ctaLabel && popup.ctaUrl && (
            <div className="mt-4">
              <Cta popup={popup} onClose={onClose} variant="solid" />
            </div>
          )}
        </div>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(1rem)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    )
  }

  // ── Bandeau bas ──
  if (popup.template === 'banner-bottom') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-[90] bg-brand text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="container flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between sm:gap-6">
          <div className="text-center sm:text-left">
            {popup.heading && <p className="font-semibold">{popup.heading}</p>}
            {popup.body && <p className="text-sm text-white/75">{popup.body}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Cta popup={popup} onClose={onClose} variant="onDark" />
            {popup.dismissible && <CloseButton onClose={onClose} label={closeLabel} tone="dark" />}
          </div>
        </div>
      </div>
    )
  }

  // ── Barre en haut ──
  return (
    <div className="fixed inset-x-0 top-0 z-[60] bg-terracotta text-terracotta-foreground">
      <div className="container flex items-center justify-between gap-4 py-2.5">
        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm sm:justify-start sm:text-left">
          {popup.heading && <span className="font-semibold">{popup.heading}</span>}
          {popup.body && <span className="opacity-80">{popup.body}</span>}
          {popup.ctaLabel && popup.ctaUrl && (
            <a
              href={popup.ctaUrl}
              onClick={() => onClose()}
              className="font-semibold underline underline-offset-4 hover:opacity-80"
            >
              {popup.ctaLabel}
            </a>
          )}
        </div>
        {popup.dismissible && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-terracotta-foreground/70 transition-colors hover:bg-black/10 hover:text-terracotta-foreground"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Chef d'orchestre ─────────────────────────────────────────────────────────

export const PopupManager: React.FC<{ popups: PopupData[]; locale?: string }> = ({
  popups,
  locale = 'fr',
}) => {
  const pathname = usePathname()
  const [active, setActive] = useState<PopupData | null>(null)

  const base = useMemo(() => {
    if (!pathname) return '/'
    const parts = pathname.split('/').filter(Boolean)
    if (parts[0] === 'fr' || parts[0] === 'en') parts.shift()
    return `/${parts.join('/')}`
  }, [pathname])

  const candidate = useMemo(
    () => popups.find((p) => matchesPath(p, base) && !alreadyShown(p)) || null,
    [popups, base],
  )

  useEffect(() => {
    if (!candidate || active) return

    const open = () => {
      markShown(candidate)
      setActive(candidate)
    }

    if (candidate.trigger === 'load') {
      const id = setTimeout(open, Math.max(0, candidate.delaySeconds || 0) * 1000)
      return () => clearTimeout(id)
    }

    if (candidate.trigger === 'scroll') {
      const onScroll = () => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const pct = max > 0 ? (window.scrollY / max) * 100 : 100
        if (pct >= (candidate.scrollPercent || 0)) {
          window.removeEventListener('scroll', onScroll)
          open()
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }

    // exit-intent (desktop) : le curseur quitte par le haut de la fenêtre
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        document.removeEventListener('mouseout', onLeave)
        open()
      }
    }
    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [candidate, active])

  const close = useCallback(() => setActive(null), [])

  // Échap ferme la modale.
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, close])

  if (!active) return null
  return <PopupView popup={active} locale={locale} onClose={close} />
}
