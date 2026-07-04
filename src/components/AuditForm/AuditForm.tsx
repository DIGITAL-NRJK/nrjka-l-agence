'use client'

import Link from 'next/link'
import React, { useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

import { getClientSideURL } from '@/utilities/getURL'
import { track, CONVERSIONS } from '@/utilities/analytics'

/**
 * Flux « Demander un audit » — multi-étapes qualifiant, pour un SITE EXISTANT.
 * Étapes : objet de l'audit · délai · coordonnées (avec l'URL du site).
 * Stocke le lead dans `contact-messages` (source_tool = 'audit'). Pas de nouvelle
 * collection ni migration. Pour une création, on renvoie vers le formulaire de contact.
 */

type Option = { value: string; fr: string; en: string }

const NEEDS: Option[] = [
  { value: 'seo', fr: 'SEO / visibilité', en: 'SEO / visibility' },
  { value: 'performance', fr: 'Performance & technique', en: 'Performance & tech' },
  { value: 'conversion', fr: 'Conversion / UX', en: 'Conversion / UX' },
  { value: 'refonte', fr: 'Refonte / modernisation', en: 'Redesign / modernization' },
  { value: 'accessibilite', fr: 'Accessibilité', en: 'Accessibility' },
  { value: 'global', fr: 'Audit global', en: 'Full audit' },
]

const TIMELINES: Option[] = [
  { value: 'asap', fr: 'Dès que possible', en: 'As soon as possible' },
  { value: '1-3m', fr: '1 à 3 mois', en: '1–3 months' },
  { value: '3-6m', fr: '3 à 6 mois', en: '3–6 months' },
  { value: '>6m', fr: 'Plus de 6 mois', en: 'More than 6 months' },
  { value: 'flexible', fr: 'Pas encore défini', en: 'Not defined yet' },
]

const t = (locale: string) =>
  locale === 'en'
    ? {
        steps: ['Focus', 'Timeline', 'Contact'],
        q1: 'What should we audit?',
        q2: 'What’s your timeline?',
        q3: 'How can we reach you?',
        siteUrl: 'URL of the site to audit',
        name: 'Full name',
        email: 'Email',
        company: 'Company',
        phone: 'Phone',
        message: 'Anything specific to look at? (optional)',
        consent: 'I agree to be contacted about my request.',
        existing: 'This audit is for an existing website. Planning a new site?',
        contactLink: 'Use the contact form',
        back: 'Back',
        next: 'Continue',
        submit: 'Send my request',
        sending: 'Sending…',
        successTitle: 'Request received 🎉',
        successBody: 'Thanks — we’ll get back to you within 48 hours with next steps.',
        home: 'Back to homepage',
        errorMsg: 'Something went wrong. Please try again or email us.',
        required: 'Please fill in the required fields (site URL, name, email).',
      }
    : {
        steps: ['Objet', 'Délai', 'Coordonnées'],
        q1: 'Sur quoi porte l’audit ?',
        q2: 'Quel est votre délai ?',
        q3: 'Comment vous recontacter ?',
        siteUrl: 'URL du site à auditer',
        name: 'Nom complet',
        email: 'Email',
        company: 'Entreprise',
        phone: 'Téléphone',
        message: 'Un point précis à examiner ? (facultatif)',
        consent: 'J’accepte d’être recontacté au sujet de ma demande.',
        existing: 'Cet audit concerne un site existant. Vous préparez une création ?',
        contactLink: 'Utilisez le formulaire de contact',
        back: 'Retour',
        next: 'Continuer',
        submit: 'Envoyer ma demande',
        sending: 'Envoi…',
        successTitle: 'Demande reçue 🎉',
        successBody: 'Merci — nous revenons vers vous sous 48 h avec les prochaines étapes.',
        home: 'Retour à l’accueil',
        errorMsg: 'Une erreur est survenue. Réessayez ou écrivez-nous par email.',
        required: 'Merci de remplir les champs obligatoires (URL du site, nom, email).',
      }

export const AuditForm: React.FC<{ locale: string }> = ({ locale }) => {
  const en = locale === 'en'
  const L = useMemo(() => t(locale), [locale])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const TOTAL = L.steps.length

  const [step, setStep] = useState(0) // 0..2
  const [need, setNeed] = useState('')
  const [timeline, setTimeline] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [company2, setCompany2] = useState('') // honeypot (doit rester vide)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const label = (opts: Option[], value: string) => {
    const o = opts.find((x) => x.value === value)
    return o ? (en ? o.en : o.fr) : value
  }
  const labelFr = (opts: Option[], value: string) => opts.find((x) => x.value === value)?.fr ?? value

  const stepValid = step === 0 ? !!need : step === 1 ? !!timeline : true
  const focusHeading = () => window.requestAnimationFrame(() => headingRef.current?.focus())

  const goNext = () => {
    if (!stepValid) return
    setStep((s) => Math.min(TOTAL - 1, s + 1))
    focusHeading()
  }
  const goBack = () => {
    setStep((s) => Math.max(0, s - 1))
    focusHeading()
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (company2) return // honeypot rempli → bot, on ignore silencieusement
    if (!siteUrl || !name || !emailValid || !consent) {
      setError(L.required)
      return
    }
    setError(null)
    setSubmitting(true)

    const summary =
      `Demande d'audit (site existant)\n` +
      `• Site : ${siteUrl}\n` +
      `• Objet : ${labelFr(NEEDS, need)}\n` +
      `• Délai : ${labelFr(TIMELINES, timeline)}\n\n` +
      (message ? message : '(pas de précision)')

    try {
      const res = await fetch(`${getClientSideURL()}/api/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          message: summary,
          type: 'quote',
          source_tool: 'audit',
          service_type: labelFr(NEEDS, need),
          services_needed: [{ service: labelFr(NEEDS, need) }],
          context: `Site : ${siteUrl} — Délai : ${labelFr(TIMELINES, timeline)}`,
          status: 'new',
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      track(CONVERSIONS.auditRequest, { objet: need, delai: timeline })
      setSubmitted(true)
      focusHeading()
    } catch {
      setError(L.errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/15">
          <Check className="h-6 w-6 text-terracotta-dark" strokeWidth={2.5} />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-ink outline-none">
          {L.successTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate">{L.successBody}</p>
        <Link
          href={en ? '/en' : '/fr'}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-medium text-ink transition-colors hover:bg-background"
        >
          {L.home}
        </Link>
      </div>
    )
  }

  const options = step === 0 ? NEEDS : step === 1 ? TIMELINES : []
  const current = step === 0 ? need : timeline
  const setCurrent = step === 0 ? setNeed : setTimeline
  const question = [L.q1, L.q2, L.q3][step]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
      {/* Mention : audit = site existant, création → contact */}
      <p className="mb-6 rounded-xl bg-background px-4 py-3 text-sm text-slate">
        {L.existing}{' '}
        <Link
          href={`/${locale}/contact`}
          className="font-medium text-terracotta-dark underline underline-offset-2 hover:text-terracotta"
        >
          {L.contactLink}
        </Link>
        .
      </p>

      {/* Progression */}
      <ol className="mb-8 flex items-center gap-2" aria-label={`${en ? 'Step' : 'Étape'} ${step + 1}/${TOTAL}`}>
        {L.steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-1.5">
            <span
              className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-terracotta' : 'bg-border'}`}
              aria-hidden
            />
            <span className={`text-xs font-medium ${i === step ? 'text-ink' : 'text-slate'}`}>{s}</span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-ink outline-none sm:text-2xl">
        {question}
      </h2>

      {/* Étapes 1–2 : choix qualifiant */}
      {step < 2 && (
        <fieldset className="mt-6">
          <legend className="sr-only">{question}</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map((o) => {
              const selected = current === o.value
              return (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-terracotta bg-terracotta/10 text-ink'
                      : 'border-border text-ink hover:border-terracotta/40 hover:bg-background'
                  }`}
                >
                  <input
                    type="radio"
                    name={`step-${step}`}
                    value={o.value}
                    checked={selected}
                    onChange={() => setCurrent(o.value)}
                    className="h-4 w-4 shrink-0 accent-terracotta"
                  />
                  {en ? o.en : o.fr}
                </label>
              )
            })}
          </div>
        </fieldset>
      )}

      {/* Étape 3 : coordonnées */}
      {step === 2 && (
        <form id="audit-form" onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Récap qualifiant */}
          <div className="sm:col-span-2 rounded-xl bg-background px-4 py-3 text-sm text-slate">
            <span className="font-medium text-ink">{label(NEEDS, need)}</span> · {label(TIMELINES, timeline)}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="af-url" className="mb-1.5 block text-sm font-medium text-ink">
              {L.siteUrl} *
            </label>
            <input
              id="af-url"
              type="url"
              required
              inputMode="url"
              placeholder="https://…"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
            />
          </div>

          <div>
            <label htmlFor="af-name" className="mb-1.5 block text-sm font-medium text-ink">
              {L.name} *
            </label>
            <input
              id="af-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
            />
          </div>
          <div>
            <label htmlFor="af-email" className="mb-1.5 block text-sm font-medium text-ink">
              {L.email} *
            </label>
            <input
              id="af-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
            />
          </div>
          <div>
            <label htmlFor="af-company" className="mb-1.5 block text-sm font-medium text-ink">
              {L.company}
            </label>
            <input
              id="af-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
            />
          </div>
          <div>
            <label htmlFor="af-phone" className="mb-1.5 block text-sm font-medium text-ink">
              {L.phone}
            </label>
            <input
              id="af-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="af-message" className="mb-1.5 block text-sm font-medium text-ink">
              {L.message}
            </label>
            <textarea
              id="af-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-terracotta"
            />
          </div>

          {/* Honeypot anti-spam : masqué, doit rester vide */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={company2}
            onChange={(e) => setCompany2(e.target.value)}
            className="hidden"
          />

          <label className="sm:col-span-2 flex items-start gap-2.5 text-sm text-slate">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta"
            />
            <span>{L.consent}</span>
          </label>

          {error && (
            <div role="alert" className="sm:col-span-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </form>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate transition-colors hover:text-ink disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" />
          {L.back}
        </button>

        {step < TOTAL - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!stepValid}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {L.next}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            form="audit-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {L.sending}
              </>
            ) : (
              L.submit
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default AuditForm
