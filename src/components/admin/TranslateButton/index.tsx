'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

type Status = 'idle' | 'loading' | 'success' | 'error'

const TranslateButton: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleTranslate = async () => {
    if (!id || !collectionSlug) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collectionSlug, id }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(
          data.message ||
            '✅ Traduction EN sauvegardée. Basculez sur la locale "English" pour relire et modifier.',
        )
      } else {
        setStatus('error')
        setMessage(data.error || 'Erreur lors de la traduction.')
      }
    } catch {
      setStatus('error')
      setMessage('Erreur réseau. Réessayez.')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 8000)
  }

  // Disabled for unsaved documents
  if (!id) {
    return (
      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#f3f4f6',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          color: '#6b7280',
        }}
      >
        💡 Sauvegardez le document pour activer la traduction automatique EN.
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '1rem',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '0.5rem',
      }}
    >
      <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#1e40af', fontWeight: 600 }}>
        🌐 Traduction automatique (FR → EN)
      </div>

      <button
        type="button"
        onClick={handleTranslate}
        disabled={status === 'loading'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1rem',
          background: status === 'loading' ? '#93c5fd' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'background 0.15s',
        }}
      >
        {status === 'loading' ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span> Traduction en cours…
          </>
        ) : (
          '✨ Traduire vers l\'anglais'
        )}
      </button>

      {message && (
        <p
          style={{
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            color: status === 'error' ? '#dc2626' : '#16a34a',
            lineHeight: 1.4,
          }}
        >
          {message}
        </p>
      )}

      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Le contenu EN existant sera écrasé. La traduction est modifiable après.
      </p>
    </div>
  )
}

export default TranslateButton
