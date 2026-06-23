'use client'

import React, { useState } from 'react'

// Bouton « Tout traduire » au niveau d'UNE collection, monté via
// admin.components.beforeListTable. Le slug et le label sont fournis par
// clientProps dans la config de chaque collection (voir collections/*.ts).
// Appelle /api/translate-all en ciblant cette seule collection.

type Props = {
  slug?: string
  label?: string
}

type State = 'idle' | 'loading' | 'success' | 'error'

const TranslateCollectionButton: React.FC<Props> = ({ slug, label }) => {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  // Sécurité : si le slug n'est pas passé, on n'affiche rien plutôt que de risquer
  // une traduction de tout le site.
  if (!slug) return null

  const name = label ?? slug

  const run = async () => {
    if (state === 'loading') return

    const ok = window.confirm(
      `Traduire FR → EN tous les documents de « ${name} » ?\n\n` +
        'Les traductions anglaises existantes de cette collection seront écrasées. ' +
        'L’opération peut prendre un moment : ne fermez pas l’onglet.',
    )
    if (!ok) return

    setState('loading')
    setMessage('')

    try {
      const res = await fetch('/api/translate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: slug }),
      })
      const data = await res.json()

      if (res.ok) {
        const summary = data.results?.[slug]
        const detail = summary
          ? `${summary.translated}/${summary.documents} document(s) traduit(s)` +
            (summary.errors?.length ? ` · ${summary.errors.length} erreur(s)` : '')
          : data.message || 'Terminé.'
        setState(summary?.errors?.length ? 'error' : 'success')
        setMessage(detail)
      } else {
        setState('error')
        setMessage(data.error || 'Échec de la traduction.')
      }
    } catch {
      setState('error')
      setMessage('Erreur réseau. Réessayez.')
    }
  }

  const messageColor =
    state === 'error' ? '#b91c1c' : state === 'success' ? '#15803d' : '#475569'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        margin: '0 0 1rem',
        padding: '0.75rem 1rem',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '0.5rem',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>
        🌐 Traduction de la collection « {name} »
      </span>

      <button
        type="button"
        onClick={run}
        disabled={state === 'loading'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.95rem',
          background: state === 'loading' ? '#93c5fd' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: state === 'loading' ? 'wait' : 'pointer',
          fontSize: '0.82rem',
          fontWeight: 600,
        }}
      >
        {state === 'loading' ? '⏳ Traduction en cours…' : '✨ Tout traduire (FR → EN)'}
      </button>

      {message && (
        <span style={{ fontSize: '0.8rem', color: messageColor }}>{message}</span>
      )}
    </div>
  )
}

export default TranslateCollectionButton
