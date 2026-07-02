import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowUpRight } from 'lucide-react'

import type { PillarsBlock as PillarsBlockProps, Expertise } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

export const PillarsBlock = async (props: PillarsBlockProps & { locale?: string }) => {
  const { eyebrow, title, intro, locale = 'fr' } = props
  const a = props.appearance || {}

  let items: Expertise[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'expertises',
      where: { featured: { equals: true }, published: { equals: true } },
      sort: 'order',
      limit: 20,
      depth: 0,
    })
    items = res.docs as Expertise[]
  } catch {
    items = []
  }

  return (
    <section id="expertises" className="container scroll-mt-28" style={bgStyle(a.background)}>
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
            <h2
              className={`${titleClass(a, 'text-4xl sm:text-5xl')} font-display font-bold leading-tight tracking-tight text-ink`}
              style={colorStyle(a.titleColor)}
            >
              {title}
            </h2>
          )}
          {intro && (
            <p
              className={`${textClass(a, 'text-lg')} mt-5 max-w-md leading-relaxed text-slate`}
              style={colorStyle(a.textColor)}
            >
              {intro}
            </p>
          )}
        </div>

        {/* Colonne droite — liste éditoriale (pôles mis en avant) */}
        {items.length > 0 && (
          <div className="border-t border-border">
            {items.map((pole, i) => {
              const highlights = (pole.highlights || []).map((h) => h.label).filter(Boolean)
              return (
                <a
                  key={pole.id}
                  href={`/${locale}/expertises/${pole.slug}`}
                  className="group flex gap-6 border-b border-border py-8 transition-all duration-300 hover:border-terracotta/50 hover:pl-2 sm:gap-8"
                >
                  <span className="font-display text-4xl font-bold leading-none tabular-nums text-ink/15 transition-colors group-hover:text-terracotta sm:text-5xl">
                    {`0${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-semibold text-ink transition-colors group-hover:text-terracotta-dark">
                        {pole.title}
                      </h3>
                      {pole.subtitle && (
                        <span className="hidden shrink-0 text-xs uppercase tracking-[0.12em] text-slate sm:block">
                          {pole.subtitle}
                        </span>
                      )}
                    </div>
                    {pole.description && (
                      <p className="mt-2.5 leading-relaxed text-slate">{pole.description}</p>
                    )}
                    {highlights.length > 0 && (
                      <p className="mt-3 text-sm text-slate/70">{highlights.join('  ·  ')}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-dark transition-all group-hover:gap-2.5">
                      En savoir plus
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
