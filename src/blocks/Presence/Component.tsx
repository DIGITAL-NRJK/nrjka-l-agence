import React from 'react'

import type { PresenceBlock as PresenceBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

import { PresenceMapClient, type PresenceLocation } from './PresenceMapClient'

const defaultLocations: PresenceLocation[] = [
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, isHeadquarters: true },
  { city: 'Nantes', country: 'France', lat: 47.2184, lng: -1.5536 },
  { city: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357 },
  { city: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.187 },
]

export const PresenceBlock: React.FC<PresenceBlockProps> = (props) => {
  const { eyebrow, title, intro, locations } = props
  const a = props.appearance || {}

  const list: PresenceLocation[] =
    locations && locations.length > 0 ? (locations as PresenceLocation[]) : defaultLocations

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="mb-12 max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {eyebrow || 'Présence'}
        </span>
        <h2
          className={`${titleClass(a, 'text-4xl sm:text-5xl')} font-display font-bold leading-tight tracking-tight text-ink`}
          style={colorStyle(a.titleColor)}
        >
          {title || 'Proches de vous, où que vous soyez'}
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

      <PresenceMapClient locations={list} />
    </section>
  )
}
