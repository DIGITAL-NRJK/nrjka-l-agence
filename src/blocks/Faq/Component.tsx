import React from 'react'

import type { FaqBlock as FaqBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

import { Accordion } from './Accordion'

export const FaqBlock: React.FC<FaqBlockProps> = (props) => {
  const { eyebrow, title, intro, items } = props
  const a = props.appearance || {}
  const list = items || []

  if (list.length === 0) return null

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
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

        <Accordion items={list} />
      </div>
    </section>
  )
}
