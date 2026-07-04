'use client'

import React, { useEffect } from 'react'

/**
 * Garde-fou ULTIME : ne se déclenche que si le layout racine lui-même échoue.
 * Il court-circuite tout le rendu (y compris le CSS global) → styles 100 % inline
 * pour garantir un rendu correct et à la charte NRJKA en toutes circonstances.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erreur critique (global-error) :', error)
  }, [error])

  const en =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/en')

  const t = en
    ? { title: 'Something went wrong', body: 'A critical error occurred. Please try again.', retry: 'Reload' }
    : { title: 'Une erreur est survenue', body: 'Une erreur critique s’est produite. Veuillez réessayer.', retry: 'Recharger' }

  return (
    <html lang={en ? 'en' : 'fr'}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#FAF8F4',
          color: '#16233F',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: '2rem',
              height: '2px',
              backgroundColor: '#C2703D',
              marginBottom: '1.5rem',
            }}
          />
          <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {t.title}
          </h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.6, color: '#5B6472' }}>{t.body}</p>
          {error?.digest && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9AA1AC' }}>
              Réf. : {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              cursor: 'pointer',
              borderRadius: '9999px',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#FFFFFF',
              backgroundColor: '#C2703D',
            }}
          >
            {t.retry}
          </button>
        </div>
      </body>
    </html>
  )
}
