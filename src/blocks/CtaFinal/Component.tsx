import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { CtaFinalBlock as CtaFinalBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

export const CtaFinalBlock: React.FC<CtaFinalBlockProps> = ({
  eyebrow,
  title,
  body,
  note,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  appearance,
}) => {
  const a = appearance || {}

  return (
    <section
      className="relative overflow-hidden bg-brand py-16 text-center sm:py-20"
      style={bgStyle(a.background)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container">
        <div className="relative mx-auto max-w-3xl">
          {eyebrow && (
            <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
              <span className="h-px w-8 bg-terracotta" />
              {eyebrow}
              <span className="h-px w-8 bg-terracotta" />
            </span>
          )}
          {title && (
            <h2
              className={`${titleClass(a, 'text-4xl sm:text-5xl lg:text-6xl')} font-bold leading-[1.05] tracking-tight text-white`}
              style={colorStyle(a.titleColor)}
            >
              {title}
            </h2>
          )}
          {body && (
            <p
              className={`${textClass(a, 'text-lg')} mx-auto mt-5 max-w-xl leading-relaxed text-white/70`}
              style={colorStyle(a.textColor)}
            >
              {body}
            </p>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryCtaLabel && (
              <a
                href={primaryCtaHref || '#'}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-xl hover:shadow-terracotta/30"
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
