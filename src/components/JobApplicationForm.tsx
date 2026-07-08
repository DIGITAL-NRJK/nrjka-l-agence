'use client'

import React, { useState } from 'react'
import { Check, Loader2, Paperclip } from 'lucide-react'

import { getClientSideURL } from '@/utilities/getURL'
import { track, CONVERSIONS } from '@/utilities/analytics'

// Formulaire de candidature (envoi multipart → /api/job-application, avec CV).
// Les libellés sont pilotables depuis l'admin (global « Carrières (textes) ») via le
// prop `labels` ; à défaut, on retombe sur les textes bilingues ci-dessous.

export type JobFormLabels = Partial<{
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedin: string
  portfolio: string
  coverLetter: string
  cv: string
  consent: string
  submit: string
  successTitle: string
  successBody: string
}>

const defaults = (locale: string) =>
  locale === 'en'
    ? {
        title: 'Apply',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        linkedin: 'LinkedIn',
        portfolio: 'Portfolio / website',
        coverLetter: 'Cover letter',
        cv: 'Attach your CV (PDF, max 5 MB)',
        consent: 'I agree that my application is stored and processed for recruitment.',
        submit: 'Send my application',
        sending: 'Sending…',
        successTitle: 'Application received',
        successBody: 'Thanks — we’ll review it and get back to you.',
        error: 'Something went wrong. Please try again.',
        required: 'Please fill in the required fields (name, email) and accept the terms.',
        privacy: 'Privacy policy',
      }
    : {
        title: 'Postuler',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        linkedin: 'LinkedIn',
        portfolio: 'Portfolio / site web',
        coverLetter: 'Lettre de motivation',
        cv: 'Joindre votre CV (PDF, max 5 Mo)',
        consent: 'J’accepte que ma candidature soit conservée et traitée à des fins de recrutement.',
        submit: 'Envoyer ma candidature',
        sending: 'Envoi…',
        successTitle: 'Candidature reçue',
        successBody: 'Merci — nous l’étudions et revenons vers vous.',
        error: 'Une erreur est survenue. Réessayez.',
        required: 'Merci de remplir les champs requis (nom, email) et d’accepter les conditions.',
        privacy: 'Politique de confidentialité',
      }

const inputCls =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-slate focus-visible:border-terracotta'
const labelCls = 'mb-1.5 block text-xs font-medium text-ink'

export const JobApplicationForm: React.FC<{
  jobOfferId: string
  jobTitle: string
  locale?: string
  labels?: JobFormLabels
}> = ({ jobOfferId, jobTitle, locale = 'fr', labels }) => {
  // Fusion : défauts bilingues + surcharges non vides venues de l'admin.
  const base = defaults(locale)
  const L = { ...base }
  if (labels) {
    for (const [k, v] of Object.entries(labels)) {
      if (typeof v === 'string' && v.trim()) (L as Record<string, string>)[k] = v
    }
  }

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [fileName, setFileName] = useState('')

  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('company')) return // honeypot
    const firstName = String(data.get('first_name') || '').trim()
    const lastName = String(data.get('last_name') || '').trim()
    const email = String(data.get('email') || '').trim()
    if (!firstName || !lastName || !emailOk(email) || data.get('consent') !== 'on') {
      setError(L.required)
      return
    }
    data.set('job_offer', jobOfferId)
    data.set('locale', locale)

    setError(null)
    setBusy(true)
    try {
      const res = await fetch(`${getClientSideURL()}/api/job-application`, {
        method: 'POST',
        body: data,
      })
      if (!res.ok) throw new Error(String(res.status))
      track(CONVERSIONS.jobApplication, { poste: jobTitle })
      setDone(true)
    } catch {
      setError(L.error)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div
        className="rounded-2xl border border-border bg-surface-soft p-7 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/15">
          <Check className="h-5 w-5 text-terracotta-dark" strokeWidth={2.5} />
        </div>
        <p className="font-display text-lg font-semibold text-ink">{L.successTitle}</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate">{L.successBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 sm:p-7" encType="multipart/form-data">
      <p className="mb-5 font-display text-lg font-semibold text-ink">
        {L.title}
        {jobTitle && <span className="text-sm font-normal text-slate"> — {jobTitle}</span>}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <div>
          <label htmlFor="ja-first" className={labelCls}>
            {L.firstName} *
          </label>
          <input id="ja-first" name="first_name" required autoComplete="given-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="ja-last" className={labelCls}>
            {L.lastName} *
          </label>
          <input id="ja-last" name="last_name" required autoComplete="family-name" className={inputCls} />
        </div>

        <div className="col-span-2">
          <label htmlFor="ja-email" className={labelCls}>
            {L.email} *
          </label>
          <input id="ja-email" type="email" name="email" required autoComplete="email" className={inputCls} />
        </div>

        <div>
          <label htmlFor="ja-phone" className={labelCls}>
            {L.phone}
          </label>
          <input id="ja-phone" type="tel" name="phone" autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="ja-linkedin" className={labelCls}>
            {L.linkedin}
          </label>
          <input id="ja-linkedin" type="url" name="linkedin_url" inputMode="url" className={inputCls} />
        </div>

        <div className="col-span-2">
          <label htmlFor="ja-portfolio" className={labelCls}>
            {L.portfolio}
          </label>
          <input id="ja-portfolio" type="url" name="portfolio_url" inputMode="url" className={inputCls} />
        </div>

        <div className="col-span-2">
          <label htmlFor="ja-cover" className={labelCls}>
            {L.coverLetter}
          </label>
          <textarea id="ja-cover" name="cover_letter" rows={4} className={inputCls} />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="ja-cv"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-background px-3.5 py-3 text-sm text-slate transition-colors hover:border-terracotta/50"
          >
            <Paperclip className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="truncate">{fileName || L.cv}</span>
          </label>
          <input
            id="ja-cv"
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx,application/pdf"
            className="sr-only"
            onChange={(ev) => setFileName(ev.target.files?.[0]?.name || '')}
          />
        </div>

        {/* Honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <label className="col-span-2 flex items-start gap-2.5 text-sm text-slate">
          <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta" />
          <span>
            {L.consent}{' '}
            <a href={`/${locale}/confidentialite`} className="text-terracotta-dark underline">
              {base.privacy}
            </a>
          </span>
        </label>

        {error && (
          <div role="alert" className="col-span-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="col-span-2 mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-2 disabled:opacity-60"
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
      </div>
    </form>
  )
}

export default JobApplicationForm
