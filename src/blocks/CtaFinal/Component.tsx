import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { CtaFinalBlock as CtaFinalBlockProps } from '@/payload-types'

export const CtaFinalBlock: React.FC<CtaFinalBlockProps> = ({
  eyebrow,
  title,
  body,
  note,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}) => {
  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-16 text-center shadow-soft sm:px-12 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-terracotta/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-terracotta/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          {eyebrow && (
            <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
              <span className="h-px w-8 bg-terracotta" />
              {eyebrow}
              <span className="h-px w-8 bg-terracotta" />
            </span>
          )}
          {title && (
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}
          {body && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">{body}</p>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryCtaLabel && (
              <a
                href={primaryCtaHref || '#'}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:bg-terracotta-dark"
              >
                {primaryCtaLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </a>
            )}
            {secondaryCtaLabel && (
              <a
                href={secondaryCtaHref || '#'}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>

          {note && (
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-white/60">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {note}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
