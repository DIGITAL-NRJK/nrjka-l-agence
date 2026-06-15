import React from 'react'

import { bgStyle, colorStyle, titleClass, textClass, type Appearance } from '@/utilities/appearance'

type Card = { title?: string | null; tagline?: string | null; id?: string | null }

export type D4CardsProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  cards?: Card[] | null
  appearance?: Appearance | null
}

export const D4CardsBlock: React.FC<D4CardsProps> = ({
  eyebrow,
  title,
  intro,
  cards,
  appearance,
}) => {
  const a = appearance || {}
  const list = cards || []

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </span>
        )}
        {title && (
          <h2
            className={`${titleClass(a, 'text-3xl sm:text-4xl')} font-display font-bold leading-tight tracking-tight text-ink`}
            style={colorStyle(a.titleColor)}
          >
            {title}
          </h2>
        )}
        {intro && (
          <p
            className={`${textClass(a, 'text-lg')} mt-5 leading-relaxed text-slate`}
            style={colorStyle(a.textColor)}
          >
            {intro}
          </p>
        )}
      </div>

      {list.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((card, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-soft"
            >
              <span className="font-display text-sm font-bold text-terracotta">{`0${i + 1}`}</span>
              {card.title && (
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                  {card.title}
                </h3>
              )}
              {card.tagline && <p className="mt-2 text-sm leading-relaxed text-slate">{card.tagline}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
