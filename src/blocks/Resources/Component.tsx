import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { ResourcesBlock as ResourcesBlockProps, Resource } from '@/payload-types'
import { ResourcesGrid } from './Client'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

export const ResourcesBlock = async (props: ResourcesBlockProps) => {
  const { eyebrow, title, intro, limit } = props
  const a = props.appearance || {}

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

      <ResourcesGrid items={items} />
    </section>
  )
}
