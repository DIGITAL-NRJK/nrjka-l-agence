'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export type MethodStep = {
  title?: string | null
  tagline?: string | null
  activities?: { label?: string | null; id?: string | null }[] | null
}

export const MethodStepper: React.FC<{ steps: MethodStep[] }> = ({ steps }) => {
  const [active, setActive] = useState(0)
  const n = steps.length
  if (n === 0) return null

  const step = steps[active]
  const activities = (step.activities || []).map((a) => a.label).filter(Boolean) as string[]
  const isLast = active === n - 1
  const progress = n > 1 ? active / (n - 1) : 0

  return (
    <div className="mt-14">
      {/* Rangée de pastilles */}
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[34rem]">
          {/* rail */}
          <div className="absolute left-7 right-7 top-7 h-px -translate-y-1/2 bg-border" />
          <div
            className="absolute left-7 top-7 h-px -translate-y-1/2 bg-terracotta transition-all duration-500"
            style={{ width: `calc((100% - 3.5rem) * ${progress})` }}
          />

          <ol className="relative flex justify-between">
            {steps.map((s, i) => {
              const done = i < active
              const current = i === active
              return (
                <li key={i} className="flex flex-1 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={current ? 'step' : undefined}
                    aria-label={s.title || `Étape ${i + 1}`}
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-lg font-bold transition-all ${
                      current
                        ? 'border-terracotta bg-brand text-white shadow-soft'
                        : done
                          ? 'border-terracotta bg-brand text-terracotta'
                          : 'border-border bg-background text-slate hover:border-terracotta/50'
                    }`}
                  >
                    {done ? <Check className="h-5 w-5 text-terracotta" strokeWidth={2.6} /> : `0${i + 1}`}
                  </button>
                  <span
                    className={`mt-3 w-24 text-center text-xs font-medium leading-tight transition-colors ${
                      current ? 'text-ink' : 'text-slate'
                    }`}
                  >
                    {s.title}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      {/* Carte de détail */}
      <div
        key={active}
        className="mt-10 rounded-3xl border border-border bg-card p-8 duration-300 animate-in fade-in slide-in-from-bottom-2 sm:p-10 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-12"
      >
        <div className="flex flex-col">
          <span className="font-display text-5xl font-bold leading-none text-ink/10">
            {`0${active + 1}`}
          </span>
          <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">
            {step.title}
          </h3>
          {step.tagline && (
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.1em] text-terracotta">
              {step.tagline}
            </p>
          )}

          <div className="mt-8">
            {isLast ? (
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
              >
                Demander un audit
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setActive((v) => Math.min(v + 1, n - 1))}
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-2"
              >
                Étape suivante
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </button>
            )}
          </div>
        </div>

        {activities.length > 0 && (
          <ul className="mt-10 space-y-3.5 lg:mt-0">
            {activities.map((label, j) => (
              <li key={j} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                <span className="leading-relaxed text-ink">{label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
