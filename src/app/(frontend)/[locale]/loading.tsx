import React from 'react'

/**
 * État de chargement affiché pendant la navigation vers une page publique.
 * Squelette sobre à la charte (pas de spinner agressif), header/footer conservés.
 */
export default function LocaleLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 rounded-full bg-terracotta/40" />
        <div className="h-10 w-3/4 rounded-lg bg-card" />
        <div className="h-10 w-1/2 rounded-lg bg-card" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full rounded bg-card" />
          <div className="h-4 w-11/12 rounded bg-card" />
          <div className="h-4 w-2/3 rounded bg-card" />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-32 rounded-2xl bg-card" />
          <div className="h-32 rounded-2xl bg-card" />
          <div className="h-32 rounded-2xl bg-card" />
        </div>
      </div>
    </div>
  )
}
