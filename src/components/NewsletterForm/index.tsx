'use client'

import React, { useState } from 'react'

/**
 * Formulaire d'inscription newsletter (double opt-in) — bilingue, prêt à l'emploi.
 * ⚠️ Non monté sur le site pour le moment. Pour l'afficher :
 *   import { NewsletterForm } from '@/components/NewsletterForm'
 *   <NewsletterForm locale={locale} source="footer" />
 */
export const NewsletterForm: React.FC<{
  locale?: string
  source?: string
  className?: string
}> = ({ locale = 'fr', source = 'site', className }) => {
  const en = locale === 'en'
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, source, website }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    // Couleur héritée du parent : lisible sur fond clair comme sur le footer sombre.
    return (
      <p role="status" className={`text-sm font-medium ${className || ''}`}>
        {en
          ? 'Almost there! Check your inbox to confirm your subscription.'
          : 'Presque terminé ! Vérifiez votre boîte mail pour confirmer votre inscription.'}
      </p>
    )
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap ${className || ''}`}
    >
      <label htmlFor="nl-email" className="sr-only">
        {en ? 'Your email' : 'Votre email'}
      </label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={en ? 'you@email.com' : 'vous@email.com'}
        className="h-12 flex-1 rounded-full border border-border bg-white px-5 text-sm text-ink outline-none transition-colors placeholder:text-slate/60 focus:ring-2 focus:ring-terracotta/40"
      />
      {/* Honeypot anti-spam : masqué, ignoré par les humains */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="h-12 shrink-0 rounded-full bg-terracotta px-6 text-sm font-semibold text-terracotta-foreground transition-colors hover:bg-terracotta-dark disabled:opacity-60"
      >
        {status === 'loading'
          ? en
            ? 'Sending…'
            : 'Envoi…'
          : en
            ? 'Subscribe'
            : "S'inscrire"}
      </button>
      {status === 'error' && (
        <p role="alert" className="w-full text-sm font-medium text-red-400">
          {en
            ? 'An error occurred. Please try again.'
            : 'Une erreur est survenue. Merci de réessayer.'}
        </p>
      )}
    </form>
  )
}
