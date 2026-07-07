'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, Download, Check, Loader2 } from 'lucide-react'

import { getClientSideURL } from '@/utilities/getURL'
import { track, CONVERSIONS } from '@/utilities/analytics'
import { useFocusTrap } from '@/utilities/useFocusTrap'

// Modale de capture pour une ressource « gated » : email requis avant l'accès.
// À la validation : lead stocké + ressource envoyée par email + lien à l'écran.

const t = (locale: string) =>
  locale === 'en'
    ? {
        eyebrow: 'Free resource',
        intro: 'Enter your email to receive it — we’ll send it to you and show the link right away.',
        name: 'First name',
        email: 'Email',
        consent: 'I agree to receive this resource and to the privacy policy.',
        submit: 'Send it to me',
        sending: 'Sending…',
        close: 'Close',
        successTitle: 'It’s ready',
        successBody: 'Your resource is available below',
        emailed: 'A copy has been sent to your inbox.',
        download: 'Download',
        error: 'Something went wrong. Please try again.',
        privacy: 'privacy policy',
      }
    : {
        eyebrow: 'Ressource gratuite',
        intro:
          'Indiquez votre email pour la recevoir — on vous l’envoie et le lien s’affiche aussitôt.',
        name: 'Prénom',
        email: 'Email',
        consent: 'J’accepte de recevoir cette ressource et la politique de confidentialité.',
        submit: 'Recevoir la ressource',
        sending: 'Envoi…',
        close: 'Fermer',
        successTitle: 'C’est prêt',
        successBody: 'Votre ressource est disponible ci-dessous',
        emailed: 'Une copie vient de vous être envoyée par email.',
        download: 'Télécharger',
        error: 'Une erreur est survenue. Réessayez.',
        privacy: 'politique de confidentialité',
      }

export const ResourceGateForm: React.FC<{
  resourceId: string
  resourceTitle: string
  locale?: string
  onClose: () => void
}> = ({ resourceId, resourceTitle, locale = 'fr', onClose }) => {
  const L = t(locale)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ downloadUrl: string | null; emailed: boolean } | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Vraie modale (aria-modal) → on confine la tabulation à l'intérieur.
  useFocusTrap(true, panelRef)

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (website) return // honeypot
    if (!name.trim() || !emailOk || !consent) {
      setError(L.error)
      return
    }
    setError(null)
    setBusy(true)
    try {
      const res = await fetch(`${getClientSideURL()}/api/resource-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, consent, resourceId, locale, website }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { downloadUrl: string | null; emailed: boolean }
      track(CONVERSIONS.resourceLead, { ressource: resourceTitle })
      setDone({ downloadUrl: data.downloadUrl, emailed: data.emailed })
    } catch {
      setError(L.error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={resourceTitle}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={L.close}
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate transition-colors hover:bg-surface-soft hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        {!done ? (
          <form onSubmit={submit} className="p-6 sm:p-7">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate">
              <span className="h-px w-6 bg-terracotta" />
              {L.eyebrow}
            </span>
            <h3 className="font-display text-xl font-bold leading-snug text-ink">{resourceTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{L.intro}</p>

            <div className="mt-5 space-y-3">
              <div>
                <label htmlFor="rg-name" className="mb-1.5 block text-sm font-medium text-ink">
                  {L.name} *
                </label>
                <input
                  id="rg-name"
                  ref={nameRef}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
                />
              </div>
              <div>
                <label htmlFor="rg-email" className="mb-1.5 block text-sm font-medium text-ink">
                  {L.email} *
                </label>
                <input
                  id="rg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
                />
              </div>

              {/* Honeypot : masqué, doit rester vide */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
              />

              <label className="flex items-start gap-2.5 text-sm text-slate">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta"
                />
                <span>
                  {L.consent.split(L.privacy)[0]}
                  <a href={`/${locale}/confidentialite`} className="text-terracotta-dark underline">
                    {L.privacy}
                  </a>
                  {L.consent.split(L.privacy)[1] || '.'}
                </span>
              </label>
            </div>

            {error && (
              <div role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-2 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {L.sending}
                </>
              ) : (
                L.submit
              )}
            </button>
          </form>
        ) : (
          <div className="p-6 text-center sm:p-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/15">
              <Check className="h-6 w-6 text-terracotta-dark" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink">{L.successTitle}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-slate">{L.successBody}</p>
            {done.downloadUrl && (
              <a
                href={done.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-2"
              >
                <Download className="h-4 w-4" strokeWidth={2.2} />
                {L.download}
              </a>
            )}
            {done.emailed && <p className="mt-4 text-xs text-slate">{L.emailed}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResourceGateForm
