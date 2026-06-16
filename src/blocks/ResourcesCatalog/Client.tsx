'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Download, Check } from 'lucide-react'

export type CatalogItem = {
  id: string
  kind: 'free' | 'paid'
  title: string
  description?: string | null
  category?: string | null // valeur de catégorie produit (null pour le gratuit)
  categoryLabel?: string | null
  formatLabel?: string | null // gratuit uniquement
  fileUrl?: string | null // gratuit uniquement
  price?: number | null // payant uniquement
  bestseller?: boolean
  features: string[]
  updatedAt?: string | null
}

export type CatalogFilter = { value: string; label: string }

const euro = (n: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)

const chip = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition-colors ${
    active
      ? 'border-terracotta bg-terracotta/10 text-ink'
      : 'border-border text-slate hover:border-brand/30 hover:text-ink'
  }`

export const CatalogGrid: React.FC<{
  items: CatalogItem[]
  filters: CatalogFilter[]
}> = ({ items, filters }) => {
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (selected === null) return items
    if (selected === 'free') return items.filter((i) => i.kind === 'free')
    return items.filter((i) => i.category === selected)
  }, [items, selected])

  return (
    <div className="mt-12">
      {/* Filtres */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setSelected(null)} className={chip(!selected)}>
            Tous
          </button>
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSelected(f.value)}
              className={chip(selected === f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          Rien dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isFree = item.kind === 'free'
            return (
              <div
                key={item.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-terracotta/40"
              >
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  {item.categoryLabel && (
                    <span className="uppercase tracking-[0.1em] text-terracotta-dark">
                      {item.categoryLabel}
                    </span>
                  )}
                  {isFree && item.formatLabel && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-slate">
                      {item.formatLabel}
                    </span>
                  )}
                  {!isFree && item.bestseller && (
                    <span className="rounded-full bg-terracotta/12 px-2.5 py-0.5 text-terracotta-dark">
                      Best-seller
                    </span>
                  )}
                </div>

                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
                )}
                {item.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pied : prix + action */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-xl font-bold text-ink">
                      {isFree ? 'Gratuit' : euro(item.price || 0)}
                    </span>
                    {isFree ? (
                      item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-2"
                        >
                          <Download className="h-4 w-4" strokeWidth={2.2} />
                          Télécharger
                        </a>
                      ) : (
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-all hover:gap-2.5"
                        >
                          Demander
                          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                        </Link>
                      )
                    ) : (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-all hover:gap-2.5"
                      >
                        Précommander
                        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                      </Link>
                    )}
                  </div>

                  {!isFree && (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Paiement en ligne bientôt disponible"
                      className="mt-4 w-full cursor-not-allowed rounded-full border border-border bg-surface-soft px-5 py-2.5 text-sm font-medium text-slate"
                    >
                      Acheter — bientôt
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
