import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type {
  CaseStudiesIndexBlock as Props,
  CaseStudy,
  Media,
} from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

import { RealisationsGrid, type IndexProject, type Taxonomy } from './Grid'

const nameOf = (rel: unknown): { id?: string; name?: string } => {
  if (rel && typeof rel === 'object' && 'name' in rel) {
    const r = rel as { id?: string | number; name?: string }
    return { id: r.id != null ? String(r.id) : undefined, name: r.name }
  }
  return {}
}

export const CaseStudiesIndexBlock = async (props: Props) => {
  const { eyebrow, title, intro } = props
  const a = props.appearance || {}

  let projects: IndexProject[] = []
  let sectors: Taxonomy[] = []
  let types: Taxonomy[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const [csRes, secRes, typeRes] = await Promise.all([
      payload.find({
        collection: 'case-studies',
        sort: ['-is_featured', '-updatedAt'],
        limit: 200,
        depth: 1,
      }),
      payload.find({ collection: 'case-study-sectors', limit: 100, sort: 'name' }),
      payload.find({ collection: 'case-study-types', limit: 100, sort: 'name' }),
    ])

    projects = (csRes.docs as CaseStudy[]).map((p) => {
      const img = p.image && typeof p.image === 'object' ? (p.image as Media) : null
      const ind = nameOf(p.industry)
      const cat = nameOf(p.category)
      const metric = p.metrics && p.metrics.length > 0 ? p.metrics[0] : null
      return {
        id: String(p.id),
        slug: p.slug,
        clientName: p.client_name,
        excerpt: p.excerpt,
        image: img?.url ? { url: img.url, alt: img.alt || p.client_name } : null,
        industryId: ind.id ?? null,
        industryName: ind.name ?? null,
        categoryId: cat.id ?? null,
        categoryName: cat.name ?? null,
        metric: metric ? { value: metric.value, label: metric.label } : null,
        techs: (p.technologies || [])
          .map((t) => t.name)
          .filter(Boolean)
          .slice(0, 4) as string[],
      }
    })

    sectors = (secRes.docs as { id: string | number; name: string }[]).map((s) => ({
      id: String(s.id),
      name: s.name,
    }))
    types = (typeRes.docs as { id: string | number; name: string }[]).map((t) => ({
      id: String(t.id),
      name: t.name,
    }))
  } catch {
    projects = []
  }

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="mb-12 max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {eyebrow || 'Réalisations'}
        </span>
        <h2
          className={`${titleClass(a, 'text-4xl sm:text-5xl')} font-display font-bold leading-tight tracking-tight text-ink`}
          style={colorStyle(a.titleColor)}
        >
          {title || 'Des projets qui parlent d’eux-mêmes'}
        </h2>
        {intro && (
          <p
            className={`${textClass(a, 'text-lg')} mt-5 leading-relaxed text-slate`}
            style={colorStyle(a.textColor)}
          >
            {intro}
          </p>
        )}
      </div>

      <RealisationsGrid projects={projects} sectors={sectors} types={types} />
    </section>
  )
}
