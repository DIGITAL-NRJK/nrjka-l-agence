'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Check, Minus, PersonStanding, Plus, RotateCcw, X } from 'lucide-react'

// Panneau de préférences d'accessibilité — sobre et honnête (PAS un overlay « de conformité »).
// L'accessibilité réelle vient du code ; ceci aide juste l'utilisateur à adapter l'affichage.
type Settings = {
  fontScale: number // 1 = 100 %
  contrast: boolean
  grayscale: boolean
  readable: boolean
  dyslexia: boolean
  textSpacing: boolean // préréglage WCAG 1.4.12
  highlightLinks: boolean
  reduceMotion: boolean
  readingGuide: boolean
  readingMask: boolean
  bigCursor: boolean
  hideImages: boolean
}

const DEFAULTS: Settings = {
  fontScale: 1,
  contrast: false,
  grayscale: false,
  readable: false,
  dyslexia: false,
  textSpacing: false,
  highlightLinks: false,
  reduceMotion: false,
  readingGuide: false,
  readingMask: false,
  bigCursor: false,
  hideImages: false,
}

const KEY = 'nrjka-a11y'

// Clés des bascules, dans l'ordre d'affichage.
const TOGGLE_KEYS: (keyof Settings)[] = [
  'contrast',
  'grayscale',
  'readable',
  'dyslexia',
  'textSpacing',
  'highlightLinks',
  'reduceMotion',
  'readingGuide',
  'readingMask',
  'bigCursor',
  'hideImages',
]

const t = (locale: string) =>
  locale === 'en'
    ? {
        openLabel: 'Accessibility options',
        panelLabel: 'Accessibility preferences',
        title: 'Accessibility',
        close: 'Close',
        textSize: 'Text size',
        decrease: 'Decrease text size',
        increase: 'Increase text size',
        reset: 'Reset',
        statement: 'Accessibility statement',
        savedNote: 'Display preferences saved on this device.',
        toggles: {
          contrast: 'High contrast',
          grayscale: 'Grayscale',
          readable: 'More legible font',
          dyslexia: 'Dyslexia-friendly font',
          textSpacing: 'Text spacing',
          highlightLinks: 'Highlight links',
          reduceMotion: 'Reduce motion',
          readingGuide: 'Reading guide',
          readingMask: 'Reading mask',
          bigCursor: 'Large cursor',
          hideImages: 'Hide images',
        } as Record<keyof Settings, string>,
      }
    : {
        openLabel: 'Options d’accessibilité',
        panelLabel: 'Préférences d’accessibilité',
        title: 'Accessibilité',
        close: 'Fermer',
        textSize: 'Taille du texte',
        decrease: 'Réduire la taille du texte',
        increase: 'Agrandir la taille du texte',
        reset: 'Réinitialiser',
        statement: 'Déclaration d’accessibilité',
        savedNote: 'Préférences d’affichage enregistrées sur cet appareil.',
        toggles: {
          contrast: 'Contraste élevé',
          grayscale: 'Niveaux de gris',
          readable: 'Police plus lisible',
          dyslexia: 'Police pour la dyslexie',
          textSpacing: 'Espacement du texte',
          highlightLinks: 'Surligner les liens',
          reduceMotion: 'Réduire les animations',
          readingGuide: 'Guide de lecture',
          readingMask: 'Masque de lecture',
          bigCursor: 'Gros curseur',
          hideImages: 'Masquer les images',
        } as Record<keyof Settings, string>,
      }

const applySettings = (s: Settings) => {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  el.style.fontSize = s.fontScale === 1 ? '' : `${Math.round(s.fontScale * 100)}%`
  el.toggleAttribute('data-a11y-contrast', s.contrast)
  el.toggleAttribute('data-a11y-grayscale', s.grayscale)
  el.toggleAttribute('data-a11y-readable', s.readable)
  el.toggleAttribute('data-a11y-dyslexia', s.dyslexia)
  el.toggleAttribute('data-a11y-spacing', s.textSpacing)
  el.toggleAttribute('data-a11y-links', s.highlightLinks)
  el.toggleAttribute('data-a11y-motion', s.reduceMotion)
  el.toggleAttribute('data-a11y-cursor', s.bigCursor)
  el.toggleAttribute('data-a11y-hideimg', s.hideImages)
}

export const AccessibilityWidget: React.FC = () => {
  const pathname = usePathname()
  const locale = pathname?.startsWith('/en') ? 'en' : 'fr'
  const L = t(locale)
  const [open, setOpen] = useState(false)
  const [cursorY, setCursorY] = useState(-200)
  const [s, setS] = useState<Settings>(DEFAULTS)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY)
      if (saved) {
        const parsed = { ...DEFAULTS, ...JSON.parse(saved) }
        setS(parsed)
        applySettings(parsed)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const update = (patch: Partial<Settings>) => {
    setS((prev) => {
      const next = { ...prev, ...patch }
      applySettings(next)
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const reset = () => {
    setS(DEFAULTS)
    applySettings(DEFAULTS)
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }

  // Guide / masque de lecture : suivent le curseur
  useEffect(() => {
    if (!s.readingGuide && !s.readingMask) return
    const onMove = (e: MouseEvent) => setCursorY(e.clientY)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [s.readingGuide, s.readingMask])

  return (
    <>
      {s.readingGuide && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 z-[60] h-10 -translate-y-1/2 border-y-2 border-terracotta/70 bg-terracotta/5"
          style={{ top: cursorY }}
        />
      )}

      {s.readingMask && (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 top-0 z-[60] bg-black/65"
            style={{ height: Math.max(0, cursorY - 60) }}
          />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] bg-black/65"
            style={{ top: cursorY + 60 }}
          />
        </>
      )}

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={L.openLabel}
        className="fixed bottom-5 right-5 z-[61] flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-soft ring-1 ring-white/10 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <PersonStanding className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Panneau */}
      {open && (
        <div
          role="dialog"
          aria-label={L.panelLabel}
          className="fixed bottom-20 right-5 z-[61] max-h-[75vh] w-[20rem] max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-2xl border border-border bg-background shadow-soft"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-display text-sm font-semibold text-ink">{L.title}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={L.close}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate hover:bg-surface-soft hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            {/* Taille du texte */}
            <div className="mb-4 flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2.5">
              <span className="text-sm font-medium text-ink">{L.textSize}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update({ fontScale: Math.max(0.9, s.fontScale - 0.1) })}
                  aria-label={L.decrease}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-slate hover:text-ink"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-xs tabular-nums text-slate">
                  {Math.round(s.fontScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => update({ fontScale: Math.min(1.5, s.fontScale + 0.1) })}
                  aria-label={L.increase}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-slate hover:text-ink"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Bascules */}
            <ul className="space-y-1">
              {TOGGLE_KEYS.map((key) => {
                const active = Boolean(s[key])
                return (
                  <li key={key}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      onClick={() => update({ [key]: !active } as Partial<Settings>)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface-soft"
                    >
                      <span>{L.toggles[key]}</span>
                      <span
                        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                          active ? 'bg-terracotta' : 'bg-border'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform ${
                            active ? 'translate-x-4' : ''
                          }`}
                        >
                          {active && <Check className="h-3 w-3 text-terracotta-dark" strokeWidth={3} />}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={reset}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-slate transition-colors hover:border-brand/30 hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              {L.reset}
            </button>

            <a
              href={`/${locale}/accessibilite`}
              className="mt-4 block text-center text-xs font-medium text-terracotta-dark underline underline-offset-2 hover:text-terracotta"
            >
              {L.statement}
            </a>

            <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-slate">{L.savedNote}</p>
          </div>
        </div>
      )}
    </>
  )
}
