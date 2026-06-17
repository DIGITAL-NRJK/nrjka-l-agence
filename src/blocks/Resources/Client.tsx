'use client'

import React, { useState } from 'react'
import { ArrowDownToLine } from 'lucide-react'

import type { Resource, Media } from '@/payload-types'

const categoryLabels: Record<string, string> = {
  guide: 'Guide',
  template: 'Modèle',
  checklist: 'Checklist',
  ebook: 'Ebook',
  tool: 'Outil',
}

const filterLabels: Record<string, string> = {
  guide: 'Guides',
  template: 'Modèles',
  checklist: 'Checklists',
  ebook: 'Ebooks',
  tool: 'Outils',
}

export const ResourcesGrid: React.FC<{ items: Resource[] }> = ({ items }) => {
  const [filter, setFilter] = useState('all')

  const categories = Array.from(new Set(items.map((r) => r.category).filter(Boolean))) as string[]
  const visible = filter === 'all' ? items : items.filter((r) => r.category === filter)

  const chip = (active: boolean) =>
    [
      'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
      active
        ? 'border-brand bg-brand text-white'
        : 'border-border text-slate hover:border-brand/40 hover:text-ink',
    ].join(' ')

  return (
    <>
      {categories.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => setFilter('all')} className={chip(filter === 'all')}>
            Toutes
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setFilter(c)}
              className={chip(filter === c)}
            >
              {filterLabels[c] || c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => {
          const file = r.file && typeof r.file === 'object' ? (r.file as Media) : null
          const href = file?.url || r.file_url || r.preview_url || '#'
          const cat = r.category ? categoryLabels[r.category] || r.category : null
          const cta = r.requires_contact ? 'Recevoir par email' : 'Télécharger'
          return (
            <a
              key={r.id}
              href={href}
              className="group flex h-full flex-col rounded-2xl bg-surface-soft p-6 transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-baseline justify-between gap-3">
                {cat && (
                  <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.15em] text-terracotta-dark">
                    {cat}
                  </span>
                )}
                {r.format && (
                  <span className="font-mono text-[0.7rem] uppercase tracking-wide text-slate">
                    {r.format}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug text-ink">{r.title}</h3>
              {r.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate">{r.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="text-sm font-medium text-ink">{cta}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-white">
                  <ArrowDownToLine className="h-4 w-4" strokeWidth={2} />
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </>
  )
}
