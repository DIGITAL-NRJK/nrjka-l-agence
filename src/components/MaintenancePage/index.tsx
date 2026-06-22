'use client'

import React, { useEffect, useState } from 'react'

type Props = {
  mode: 'maintenance' | 'coming_soon'
  title: string
  message: string
  countdownDate?: string | null
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

export const MaintenancePage: React.FC<Props> = ({ mode, title, message, countdownDate, locale = 'fr' }) => {
  const countdown = useCountdown(mode === 'coming_soon' ? countdownDate : null)
  const labels = {
    days: locale === 'en' ? 'days' : 'jours',
    hours: locale === 'en' ? 'hours' : 'heures',
    minutes: locale === 'en' ? 'min' : 'min',
    seconds: locale === 'en' ? 'sec' : 'sec',
  }

  const isMaintenance = mode === 'maintenance'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      {/* Icône */}
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-4xl">
        {isMaintenance ? '🔧' : '🚀'}
      </div>

      {/* Titre */}
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h1>

      {/* Message */}
      <p className="mt-6 max-w-md text-lg leading-relaxed text-slate">{message}</p>

      {/* Countdown — coming soon uniquement */}
      {mode === 'coming_soon' && countdownDate && (
        <div className="mt-12 grid grid-cols-4 gap-4">
          {[
            { value: countdown.days, label: labels.days },
            { value: countdown.hours, label: labels.hours },
            { value: countdown.minutes, label: labels.minutes },
            { value: countdown.seconds, label: labels.seconds },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-2xl border border-border bg-surface-soft px-6 py-5"
            >
              <span className="font-display text-3xl font-bold tabular-nums text-ink">
                {String(value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-slate">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Logo / branding */}
      <div className="mt-16 text-sm text-slate/60">
        <span className="font-semibold text-brand">NRJKA Digital</span>
      </div>
    </div>
  )
}
