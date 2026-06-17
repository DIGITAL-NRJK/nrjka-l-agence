'use client'

import React, { useEffect, useState } from 'react'
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

  const toggles: { key: keyof Settings; label: string }[] = [
    { key: 'contrast', label: 'Contraste élevé' },
    { key: 'grayscale', label: 'Niveaux de gris' },
    { key: 'readable', label: 'Police plus lisible' },
    { key: 'dyslexia', label: 'Police pour la dyslexie' },
    { key: 'textSpacing', label: 'Espacement du texte' },
    { key: 'highlightLinks', label: 'Surligner les liens' },
    { key: 'reduceMotion', label: 'Réduire les animations' },
    { key: 'readingGuide', label: 'Guide de lecture' },
    { key: 'readingMask', label: 'Masque de lecture' },
    { key: 'bigCursor', label: 'Gros curseur' },
    { key: 'hideImages', label: 'Masquer les images' },
  ]

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
        aria-label="Options d’accessibilité"
        className="fixed bottom-5 right-5 z-[61] flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-soft ring-1 ring-white/10 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <PersonStanding className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Panneau */}
      {open && (
        <div
          role="dialog"
          aria-label="Préférences d’accessibilité"
          className="fixed bottom-20 right-5 z-[61] max-h-[75vh] w-[20rem] max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-2xl border border-border bg-background shadow-soft"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-display text-sm font-semibold text-ink">Accessibilité</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate hover:bg-surface-soft hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            {/* Taille du texte */}
            <div className="mb-4 flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2.5">
              <span className="text-sm font-medium text-ink">Taille du texte</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update({ fontScale: Math.max(0.9, s.fontScale - 0.1) })}
                  aria-label="Réduire la taille du texte"
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
                  aria-label="Agrandir la taille du texte"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-slate hover:text-ink"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Bascules */}
            <ul className="space-y-1">
              {toggles.map(({ key, label }) => {
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
                      <span>{label}</span>
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
              Réinitialiser
            </button>

            <a
              href="/accessibilite"
              className="mt-4 block text-center text-xs font-medium text-terracotta-dark underline underline-offset-2 hover:text-terracotta"
            >
              Déclaration d’accessibilité
            </a>

            <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-slate">
              Préférences d’affichage enregistrées sur cet appareil.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
