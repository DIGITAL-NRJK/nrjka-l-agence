'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export type IndexProject = {
  id: string
  slug: string
  clientName: string
  excerpt?: string | null
  image?: { url: string; alt: string } | null
  industryId?: string | null
  industryName?: string | null
  categoryId?: string | null
  categoryName?: string | null
  metric?: { value: string; label: string } | null
  techs: string[]
}

export type Taxonomy = { id: string; name: string }

const chip = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition-colors ${
    active
      ? 'border-terracotta bg-terracotta/10 text-ink'
      : 'border-border text-slate hover:border-brand/30 hover:text-ink'
  }`

export const RealisationsGrid: React.FC<{
  projects: IndexProject[]
  sectors: Taxonomy[]
  types: Taxonomy[]
  locale?: string
}> = ({ projects, sectors, types, locale = 'fr' }) => {
  const [sector, setSector] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!sector || p.industryId === sector) && (!type || p.categoryId === type),
      ),
    [projects, sector, type],
  )

  return (
    <div>
      {/* Filtres */}
      {(sectors.length > 0 || types.length > 0) && (
        <div className="mb-10 space-y-4">
          {sectors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
                Secteur
              </span>
              <button type="button" onClick={() => setSector(null)} className={chip(!sector)}>
                Tous
              </button>
              {sectors.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSector(s.id)}
                  className={chip(sector === s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
          {types.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
                Type
              </span>
              <button type="button" onClick={() => setType(null)} className={chip(!type)}>
                Tous
              </button>
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={chip(type === t.id)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grille */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/realisations/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-terracotta/40"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-brand">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image.url}
                    alt={p.image.alt || p.clientName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-white/60">
                    {p.clientName}
                  </div>
                )}
                {p.industryName && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                    {p.industryName}
                  </span>
                )}
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold text-ink">{p.clientName}</h3>
                {p.excerpt && (
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate">
                    {p.excerpt}
                  </p>
                )}
                {p.metric && (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold text-terracotta-dark">{p.metric.value}</span>{' '}
                    <span className="text-slate">{p.metric.label}</span>
                  </p>
                )}
                {p.techs.length > 0 && (
                  <p className="mt-auto pt-4 font-mono text-xs text-slate">
                    {p.techs.join(' · ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          Aucune réalisation ne correspond à ces filtres pour le moment.
        </p>
      )}
    </div>
  )
}
