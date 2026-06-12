import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowDownToLine } from 'lucide-react'

import type { ResourcesBlock as ResourcesBlockProps, Resource, Media } from '@/payload-types'

const categoryLabels: Record<string, string> = {
  guide: 'Guide',
  template: 'Modèle',
  checklist: 'Checklist',
  ebook: 'Ebook',
  tool: 'Outil',
}

export const ResourcesBlock = async (props: ResourcesBlockProps) => {
  const { eyebrow, title, intro, limit } = props

  let items: Resource[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'resources',
      where: { published: { equals: true } },
      sort: '-updatedAt',
      limit: limit || 3,
      depth: 1,
    })
    items = res.docs
  } catch {
    items = []
  }

  if (items.length === 0) return null

  return (
    <section className="container">
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

      <div className="mt-12 border-t border-border">
        {items.map((r) => {
          const file = r.file && typeof r.file === 'object' ? (r.file as Media) : null
          const href = file?.url || r.file_url || r.preview_url || '#'
          const cat = r.category ? categoryLabels[r.category] || r.category : null
          const cta = r.requires_contact ? 'Recevoir par email' : 'Télécharger'
          return (
            <a
              key={r.id}
              href={href}
              className="group flex flex-col gap-3 border-b border-border py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2.5 text-xs">
                  {cat && (
                    <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 font-medium text-terracotta-dark">
                      {cat}
                    </span>
                  )}
                  {r.format && (
                    <span className="font-mono uppercase tracking-wide text-slate">{r.format}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-terracotta-dark">
                  {r.title}
                </h3>
                {r.description && (
                  <p className="mt-1 leading-relaxed text-slate">{r.description}</p>
                )}
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink">
                {cta}
                <ArrowDownToLine
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  strokeWidth={2}
                />
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
