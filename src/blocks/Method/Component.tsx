import React from 'react'

import type { MethodBlock as MethodBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

import { MethodStepper, type MethodStep } from './Stepper'

export const MethodBlock: React.FC<MethodBlockProps & { locale?: string }> = ({
  eyebrow,
  title,
  intro,
  steps,
  appearance,
  locale = 'fr',
}) => {
  const list = (steps || []) as MethodStep[]
  const a = appearance || {}

  return (
    <section className="container" style={bgStyle(a.background)}>
      {/* En-tête */}
      <div className="max-w-2xl">
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
            className={`${textClass(a, 'text-lg')} mt-5 leading-relaxed text-slate`}
            style={colorStyle(a.textColor)}
          >
            {intro}
          </p>
        )}
      </div>

      {/* Stepper interactif (4 D) */}
      {list.length > 0 && <MethodStepper steps={list} locale={locale} />}
    </section>
  )
}
