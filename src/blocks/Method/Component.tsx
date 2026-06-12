import React from 'react'

import type { MethodBlock as MethodBlockProps } from '@/payload-types'

export const MethodBlock: React.FC<MethodBlockProps> = ({ eyebrow, title, intro, steps }) => {
  const list = steps || []

  return (
    <section className="container">
      {/* En-tête */}
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </span>
        )}
        {title && (
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
        )}
        {intro && <p className="mt-5 text-lg leading-relaxed text-slate">{intro}</p>}
      </div>

      {/* Parcours en 4 temps */}
      {list.length > 0 && (
        <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((step, i) => {
            const activities = (step.activities || []).map((a) => a.label).filter(Boolean)
            return (
              <li key={i} className="relative">
                {/* fil de liaison (desktop, sauf le dernier) */}
                {i < list.length - 1 && (
                  <span className="absolute left-14 -right-8 top-7 hidden h-px -translate-y-1/2 bg-gradient-to-r from-terracotta via-terracotta/40 to-border lg:block" />
                )}
                {/* nœud numéroté */}
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-terracotta/50 bg-background font-display text-lg font-bold text-terracotta">
                  {`0${i + 1}`}
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-ink">
                  {step.title ? (
                    <>
                      <span className="text-terracotta-dark">{step.title.charAt(0)}</span>
                      {step.title.slice(1)}
                    </>
                  ) : null}
                </h3>
                {step.tagline && (
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.08em] text-terracotta">
                    {step.tagline}
                  </p>
                )}
                {activities.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {activities.map((a, j) => (
                      <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
