import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import type { PillarsBlock as PillarsBlockProps } from '@/payload-types'

export const PillarsBlock: React.FC<PillarsBlockProps> = ({ eyebrow, title, intro, pillars }) => {
  return (
    <section className="container">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Colonne gauche — intro fixe */}
        <div className="lg:sticky lg:top-28 lg:self-start">
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
          {intro && <p className="mt-5 max-w-md text-lg leading-relaxed text-slate">{intro}</p>}
        </div>

        {/* Colonne droite — liste éditoriale */}
        {pillars && pillars.length > 0 && (
          <div className="border-t border-border">
            {pillars.map((pillar, i) => {
              const services = (pillar.services || []).map((s) => s.label).filter(Boolean)
              const rowClass = 'group flex gap-6 border-b border-border py-8 sm:gap-8'
              const inner = (
                <>
                  <span className="font-display text-4xl font-bold leading-none tabular-nums text-ink/15 transition-colors group-hover:text-terracotta sm:text-5xl">
                    {`0${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-semibold text-ink transition-colors group-hover:text-terracotta-dark">
                        {pillar.title}
                      </h3>
                      {pillar.subtitle && (
                        <span className="hidden shrink-0 text-xs uppercase tracking-[0.12em] text-slate sm:block">
                          {pillar.subtitle}
                        </span>
                      )}
                    </div>
                    {pillar.description && (
                      <p className="mt-2.5 leading-relaxed text-slate">{pillar.description}</p>
                    )}
                    {services.length > 0 && (
                      <p className="mt-3 text-sm text-slate/70">{services.join('  ·  ')}</p>
                    )}
                  </div>
                  {pillar.link && (
                    <ArrowUpRight
                      className="mt-1 h-5 w-5 shrink-0 text-slate transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-terracotta"
                      strokeWidth={2}
                    />
                  )}
                </>
              )
              return pillar.link ? (
                <a key={i} href={pillar.link} className={rowClass}>
                  {inner}
                </a>
              ) : (
                <div key={i} className={rowClass}>
                  {inner}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
