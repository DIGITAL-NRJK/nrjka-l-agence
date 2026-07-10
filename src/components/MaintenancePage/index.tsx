'use client'

import React, { useEffect, useState } from 'react'

type Template = 'minimal' | 'countdown' | 'image' | 'notify'

type Props = {
  mode: 'maintenance' | 'coming_soon'
  title: string
  message: string
  countdownDate?: string | null
  template?: Template
  backgroundImageUrl?: string | null
  notifyConfirmation?: string | null
  locale?: string
}

function useCountdown(targetDate?: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!targetDate) return
    const target = new Date(targetDate).getTime()

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

/** Grille de compte à rebours, déclinable pour fond clair ou sombre. */
const CountdownGrid: React.FC<{
  countdownDate: string
  locale: string
  tone?: 'light' | 'dark'
}> = ({ countdownDate, locale, tone = 'light' }) => {
  const countdown = useCountdown(countdownDate)
  const en = locale === 'en'
  const labels = {
    days: en ? 'days' : 'jours',
    hours: en ? 'hours' : 'heures',
    minutes: 'min',
    seconds: 'sec',
  }

  const cell =
    tone === 'dark'
      ? 'border-white/15 bg-white/5 text-white'
      : 'border-border bg-surface-soft text-ink'
  const sub = tone === 'dark' ? 'text-white/60' : 'text-slate'

  return (
    <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-4">
      {[
        { value: countdown.days, label: labels.days },
        { value: countdown.hours, label: labels.hours },
        { value: countdown.minutes, label: labels.minutes },
        { value: countdown.seconds, label: labels.seconds },
      ].map(({ value, label }) => (
        <div
          key={label}
          className={`flex flex-col items-center rounded-2xl border px-4 py-4 sm:px-6 sm:py-5 ${cell}`}
        >
          <span className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
            {String(value).padStart(2, '0')}
          </span>
          <span
            className={`mt-1 text-[0.65rem] font-medium uppercase tracking-widest sm:text-xs ${sub}`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Formulaire de capture d'email « Prévenez-moi » → contact-messages. */
const NotifyForm: React.FC<{ locale: string; confirmation: string; tone?: 'light' | 'dark' }> = ({
  locale,
  confirmation,
  tone = 'light',
}) => {
  const en = locale === 'en'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0] || 'Prospect',
          email,
          message: en ? 'Notify me when the site launches.' : 'Prévenez-moi au lancement du site.',
          type: 'general',
          source_tool: 'maintenance_notify',
          context: 'maintenance/coming-soon',
        }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const dark = tone === 'dark'

  if (status === 'done') {
    return (
      <p className={`mt-8 max-w-md text-base font-medium ${dark ? 'text-white' : 'text-ink'}`}>
        {confirmation}
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="notify-email" className="sr-only">
        {en ? 'Your email' : 'Votre email'}
      </label>
      <input
        id="notify-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={en ? 'you@email.com' : 'vous@email.com'}
        className={`h-12 flex-1 rounded-full border px-5 text-sm outline-none transition-colors focus:ring-2 focus:ring-terracotta/40 ${
          dark
            ? 'border-white/20 bg-white/10 text-white placeholder:text-white/50'
            : 'border-border bg-white text-ink placeholder:text-slate/60'
        }`}
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
            ? 'Notify me'
            : 'Prévenez-moi'}
      </button>
      {status === 'error' && (
        <span className="sr-only" role="alert">
          {en ? 'An error occurred.' : 'Une erreur est survenue.'}
        </span>
      )}
    </form>
  )
}

export const MaintenancePage: React.FC<Props> = ({
  mode,
  title,
  message,
  countdownDate,
  template = 'minimal',
  backgroundImageUrl,
  notifyConfirmation,
  locale = 'fr',
}) => {
  const en = locale === 'en'
  const isMaintenance = mode === 'maintenance'
  const showCountdown = mode === 'coming_soon' && Boolean(countdownDate)
  const confirmation =
    notifyConfirmation ||
    (en
      ? 'Thank you! We will let you know at launch.'
      : 'Merci ! Nous vous préviendrons dès le lancement.')

  // ─── Image plein écran ────────────────────────────────────────────────────
  if (template === 'image') {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {backgroundImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-brand" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">{message}</p>
          {showCountdown && (
            <CountdownGrid countdownDate={countdownDate!} locale={locale} tone="dark" />
          )}
          <div className="mt-14 text-sm font-semibold uppercase tracking-widest text-white/70">
            NRJKA Digital
          </div>
        </div>
      </div>
    )
  }

  // ─── Marque + compte à rebours (fond navy) ────────────────────────────────
  if (template === 'countdown') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand px-6 text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
          {isMaintenance ? '🔧' : '🚀'}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">{message}</p>
        {showCountdown && (
          <CountdownGrid countdownDate={countdownDate!} locale={locale} tone="dark" />
        )}
        <div className="mt-16 text-sm font-semibold uppercase tracking-widest text-white/70">
          NRJKA Digital
        </div>
      </div>
    )
  }

  // ─── Capture email « Prévenez-moi » ───────────────────────────────────────
  if (template === 'notify') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-4xl">
          {isMaintenance ? '🔧' : '🚀'}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-slate">{message}</p>
        <NotifyForm locale={locale} confirmation={confirmation} />
        {showCountdown && (
          <CountdownGrid countdownDate={countdownDate!} locale={locale} tone="light" />
        )}
        <div className="mt-16 text-sm text-slate/60">
          <span className="font-semibold text-brand">NRJKA Digital</span>
        </div>
      </div>
    )
  }

  // ─── Minimal centré (défaut) ──────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-4xl">
        {isMaintenance ? '🔧' : '🚀'}
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-slate">{message}</p>
      {showCountdown && (
        <CountdownGrid countdownDate={countdownDate!} locale={locale} tone="light" />
      )}
      <div className="mt-16 text-sm text-slate/60">
        <span className="font-semibold text-brand">NRJKA Digital</span>
      </div>
    </div>
  )
}
