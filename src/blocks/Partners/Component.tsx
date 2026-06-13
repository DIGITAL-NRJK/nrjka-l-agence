import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowUpRight } from 'lucide-react'

import type { PartnersBlock as PartnersBlockProps, CaseStudy, Media } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

const techCategories = [
  { value: 'web', label: 'Web' },
  { value: 'data', label: 'Data' },
  { value: 'automation', label: 'Automatisation' },
  { value: 'ai', label: 'IA' },
  { value: 'security', label: 'Sécurité' },
  { value: 'other', label: 'Autre' },
]

export const PartnersBlock = async (props: PartnersBlockProps) => {
  const { eyebrow, title, intro, projectsLimit, techLabel, technologies, ctaLabel, ctaHref } = props
  const a = props.appearance || {}

  const techs = technologies || []
  const hasOpenSource = techs.some((t) => t.openSource)

  let projects: CaseStudy[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'case-studies',
      where: { is_featured: { equals: true } },
      sort: '-updatedAt',
      limit: projectsLimit || 3,
      depth: 1,
    })
    projects = res.docs
  } catch {
    projects = []
  }

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
            className={`${titleClass(a, 'text-4xl sm:text-5xl')} font-bold leading-tight tracking-tight text-ink`}
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

      {projects.length > 0 && (
        <div
          className={
            projects.length === 1 ? 'mt-12' : 'mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {projects.map((p) => {
            const single = projects.length === 1
            const img = p.image && typeof p.image === 'object' ? (p.image as Media) : null
            const industryName =
              p.industry && typeof p.industry === 'object' && 'name' in p.industry
                ? (p.industry as { name?: string }).name
                : undefined
            const techList = (p.technologies || [])
              .map((t) => t.name)
              .filter(Boolean)
              .slice(0, 4)
            const metric = p.metrics && p.metrics.length > 0 ? p.metrics[0] : null
            return (
              <div
                key={p.id}
                className={[
                  'group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-terracotta/40',
                  single ? 'lg:grid lg:grid-cols-[1.05fr_0.95fr]' : 'flex flex-col',
                ].join(' ')}
              >
                <div
                  className={[
                    'relative overflow-hidden bg-brand',
                    single ? 'aspect-16/10 lg:aspect-auto lg:min-h-88' : 'aspect-16/10',
                  ].join(' ')}
                >
                  {img ? (
                    <img
                      src={img.url || ''}
                      alt={img.alt || p.client_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-white/30">
                      {p.client_name}
                    </div>
                  )}
                  {industryName && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                      {industryName}
                    </span>
                  )}
                </div>
                <div
                  className={
                    single
                      ? 'flex flex-col justify-center p-6 sm:p-8 lg:p-12'
                      : 'flex flex-1 flex-col p-5'
                  }
                >
                  <h3
                    className={
                      single ? 'text-2xl font-semibold text-ink' : 'font-semibold text-ink'
                    }
                  >
                    {p.client_name}
                  </h3>
                  {p.excerpt && (
                    <p
                      className={
                        single
                          ? 'mt-3 leading-relaxed text-slate'
                          : 'mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate'
                      }
                    >
                      {p.excerpt}
                    </p>
                  )}
                  {metric && (
                    <p className={single ? 'mt-5' : 'mt-3 text-sm'}>
                      <span
                        className={
                          single
                            ? 'font-display text-3xl font-bold text-terracotta-dark'
                            : 'font-semibold text-terracotta-dark'
                        }
                      >
                        {metric.value}
                      </span>{' '}
                      <span className="text-slate">{metric.label}</span>
                    </p>
                  )}
                  {techList.length > 0 && (
                    <p
                      className={
                        single
                          ? 'mt-6 font-mono text-xs text-slate'
                          : 'mt-auto pt-4 font-mono text-xs text-slate'
                      }
                    >
                      {techList.join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {techs.length > 0 && (
        <div className="mt-14">
          {techLabel && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-slate">
              {techLabel}
            </p>
          )}
          <div>
            {techCategories.map((cat) => {
              const items = techs.filter((t) => (t.category || 'web') === cat.value)
              if (items.length === 0) return null
              return (
                <div
                  key={cat.value}
                  className="grid gap-3 border-t border-border py-6 sm:grid-cols-[160px_1fr] sm:gap-8"
                >
                  <div className="text-sm font-semibold uppercase tracking-wider text-ink">
                    {cat.label}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((tech, i) => {
                      const logo =
                        tech.logo && typeof tech.logo === 'object' ? (tech.logo as Media) : null
                      return (
                        <span
                          key={i}
                          className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 transition-all hover:-translate-y-0.5 hover:border-terracotta/40 hover:shadow-soft"
                        >
                          {logo && (
                            <img
                              src={logo.url || ''}
                              alt={logo.alt || tech.name || ''}
                              className="h-5 w-auto opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                            />
                          )}
                          <span className="text-sm font-medium text-ink">{tech.name}</span>
                          {tech.openSource && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          {hasOpenSource && (
            <p className="mt-6 flex items-center gap-2 text-xs text-slate">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              Open source
            </p>
          )}
        </div>
      )}

      {ctaLabel && (
        <div className="mt-10">
          <a
            href={ctaHref || '#'}
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-brand-foreground transition-colors hover:bg-brand-2"
          >
            {ctaLabel}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </a>
        </div>
      )}
    </section>
  )
}
