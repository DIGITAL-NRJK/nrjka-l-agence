import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Product, Resource } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass, type Appearance } from '@/utilities/appearance'
import { CatalogGrid, type CatalogItem, type CatalogFilter } from './Client'

export type ResourcesCatalogProps = {
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  appearance?: Appearance | null
}

const PRODUCT_CATEGORIES: Record<string, string> = {
  templates: 'Templates',
  formations: 'Formations',
  tools: 'Outils',
  packs: 'Packs',
}
const PRODUCT_CATEGORY_ORDER = ['templates', 'formations', 'tools', 'packs']

const RESOURCE_CATEGORIES: Record<string, string> = {
  guide: 'Guide',
  template: 'Modèle',
  checklist: 'Checklist',
  ebook: 'Ebook',
  tool: 'Outil',
}
const RESOURCE_FORMATS: Record<string, string> = {
  pdf: 'PDF',
  docx: 'Word',
  xlsx: 'Excel',
  notion: 'Notion',
  figma: 'Figma',
  other: 'Autre',
}

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

export const ResourcesCatalogBlock = async (props: ResourcesCatalogProps & { locale?: string }) => {
  const blockLocale = props.locale || 'fr'
  const { eyebrow, title, subtitle } = props
  const a = props.appearance || {}

  let resourcesDocs: Resource[] = []
  let productsDocs: Product[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const [r, p] = await Promise.all([
      payload.find({
        collection: 'resources',
        where: { published: { equals: true } },
        sort: '-updatedAt',
        limit: 50,
        depth: 1,
      }),
      payload.find({
        collection: 'products',
        where: { published: { equals: true } },
        sort: '-updatedAt',
        limit: 50,
        depth: 1,
      }),
    ])
    resourcesDocs = r.docs as Resource[]
    productsDocs = p.docs as Product[]
  } catch {
    resourcesDocs = []
    productsDocs = []
  }

  const freeItems: CatalogItem[] = resourcesDocs.map((r) => {
    const gated = Boolean(r.requires_contact)
    const fileHref = r.file_url || mediaUrl(r.file)
    return {
      id: `r-${r.id}`,
      resourceId: String(r.id),
      kind: 'free' as const,
      title: r.title,
      description: r.description,
      category: null,
      categoryLabel: r.category ? RESOURCE_CATEGORIES[r.category] ?? null : null,
      formatLabel: r.format ? RESOURCE_FORMATS[r.format] ?? null : null,
      // ⚠️ Ressource gated : on NE divulgue PAS l'URL au client (le gate serait
      // contournable via le source). Elle n'est renvoyée qu'après capture, par /api/resource-lead.
      fileUrl: gated ? null : fileHref,
      gated,
      // Indique juste s'il existe un fichier (sans l'exposer) : une ressource gated
      // SANS fichier n'a rien à livrer → on n'affiche pas « Recevoir ».
      hasFile: Boolean(fileHref),
      features: (r.features || []).map((f) => f.feature).filter(Boolean) as string[],
      updatedAt: r.updatedAt,
    }
  })

  const paidItems: CatalogItem[] = productsDocs.map((p) => ({
    id: `p-${p.id}`,
    kind: 'paid',
    title: p.title,
    description: p.description,
    category: p.category ?? null,
    categoryLabel: p.category ? PRODUCT_CATEGORIES[p.category] ?? null : null,
    price: p.price,
    bestseller: Boolean(p.bestseller),
    features: (p.features || []).map((f) => f.feature).filter(Boolean) as string[],
    updatedAt: p.updatedAt,
  }))

  const items = [...freeItems, ...paidItems].sort((x, y) =>
    (y.updatedAt || '').localeCompare(x.updatedAt || ''),
  )

  const present = new Set(paidItems.map((p) => p.category).filter(Boolean) as string[])
  const filters: CatalogFilter[] = [
    ...(freeItems.length > 0 ? [{ value: 'free', label: 'Gratuit' }] : []),
    ...PRODUCT_CATEGORY_ORDER.filter((c) => present.has(c)).map((c) => ({
      value: c,
      label: PRODUCT_CATEGORIES[c],
    })),
  ]

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </span>
        )}
        {title && (
          <h1
            className={`${titleClass(a, 'text-4xl sm:text-5xl lg:text-6xl')} font-display font-bold leading-[1.05] tracking-tight text-ink`}
            style={colorStyle(a.titleColor)}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className={`${textClass(a, 'text-lg')} mt-6 leading-relaxed text-slate`}
            style={colorStyle(a.textColor)}
          >
            {subtitle}
          </p>
        )}
      </div>

      <CatalogGrid items={items} filters={filters} locale={blockLocale} />
    </section>
  )
}
