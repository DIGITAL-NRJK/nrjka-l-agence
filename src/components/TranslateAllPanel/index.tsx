'use client'

import React, { useState } from 'react'

// Collections traduisibles (doit refléter TRANSLATABLE_COLLECTIONS de api/translate/core.ts).
const COLLECTIONS = [
  { slug: 'pages', label: 'Pages' },
  { slug: 'posts', label: 'Articles' },
  { slug: 'services', label: 'Services' },
  { slug: 'expertises', label: 'Pôles & expertises' },
  { slug: 'testimonials', label: 'Témoignages' },
  { slug: 'case-studies', label: 'Réalisations' },
  { slug: 'resources', label: 'Ressources' },
  { slug: 'job-offers', label: 'Offres d’emploi' },
] as const

type RowStatus = { state: 'idle' | 'running' | 'done' | 'error'; detail?: string }

const TranslateAllPanel: React.FC = () => {
  const [running, setRunning] = useState(false)
  const [rows, setRows] = useState<Record<string, RowStatus>>({})

  const runAll = async () => {
    if (running) return
    const ok = window.confirm(
      'Traduire FR → EN tout le contenu du site ?\n\nLes traductions anglaises existantes seront écrasées. Opération longue (plusieurs minutes) : ne fermez pas l’onglet.',
    )
    if (!ok) return

    setRunning(true)
    setRows(Object.fromEntries(COLLECTIONS.map((c) => [c.slug, { state: 'idle' }])))

    for (const c of COLLECTIONS) {
      setRows((r) => ({ ...r, [c.slug]: { state: 'running' } }))
      try {
        const res = await fetch('/api/translate-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collection: c.slug }),
        })
        const data = await res.json()
        if (res.ok) {
          const summary = data.results?.[c.slug]
          const detail = summary
            ? `${summary.translated}/${summary.documents} traduit(s)${
                summary.errors?.length ? ` · ${summary.errors.length} erreur(s)` : ''
              }`
            : 'OK'
          setRows((r) => ({
            ...r,
            [c.slug]: { state: summary?.errors?.length ? 'error' : 'done', detail },
          }))
        } else {
          setRows((r) => ({ ...r, [c.slug]: { state: 'error', detail: data.error || 'échec' } }))
        }
      } catch {
        setRows((r) => ({ ...r, [c.slug]: { state: 'error', detail: 'erreur réseau' } }))
      }
    }

    setRunning(false)
  }

  const icon = (s?: RowStatus) => {
    switch (s?.state) {
      case 'running':
        return '⏳'
      case 'done':
        return '✅'
      case 'error':
        return '⚠️'
      default:
        return '·'
    }
  }

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '0.5rem',
      }}
    >
      <div style={{ fontSize: '0.95rem', color: '#1e40af', fontWeight: 700, marginBottom: '0.25rem' }}>
        🌐 Traduction du site (FR → EN)
      </div>
      <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.75rem' }}>
        Traduit automatiquement tout le contenu (titres, descriptions, corps, FAQ…) de toutes les
        collections. Le français reste la source. <strong>Les traductions EN existantes seront
        écrasées.</strong>
      </p>

      <button
        type="button"
        onClick={runAll}
        disabled={running}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.55rem 1.1rem',
          background: running ? '#93c5fd' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: running ? 'wait' : 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        {running ? '⏳ Traduction en cours…' : '✨ Tout traduire'}
      </button>

      {Object.keys(rows).length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.9rem 0 0', fontSize: '0.8rem' }}>
          {COLLECTIONS.map((c) => {
            const s = rows[c.slug]
            return (
              <li
                key={c.slug}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.25rem 0',
                  color: s?.state === 'error' ? '#b91c1c' : '#334155',
                }}
              >
                <span>
                  {icon(s)} {c.label}
                </span>
                <span style={{ color: '#64748b' }}>{s?.detail || ''}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TranslateAllPanel
