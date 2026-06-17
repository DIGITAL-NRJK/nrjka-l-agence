import React from 'react'
import { Shield } from 'lucide-react'

import { iconMap } from '@/utilities/icons'
import { bgStyle, colorStyle, titleClass, textClass, type Appearance } from '@/utilities/appearance'

type Item = {
  icon?: string | null
  title?: string | null
  description?: string | null
  id?: string | null
}

export type DistinctionsProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  items?: Item[] | null
  appearance?: Appearance | null
}

export const DistinctionsBlock: React.FC<DistinctionsProps> = ({
  eyebrow,
  title,
  intro,
  items,
  appearance,
}) => {
  const a = appearance || {}
  const list = items || []

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
            className={`${titleClass(a, 'text-3xl sm:text-4xl')} font-display font-bold leading-tight tracking-tight text-ink`}
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

      {list.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => {
            const Icon = (item.icon && iconMap[item.icon as keyof typeof iconMap]) || Shield
            return (
              <div key={i} className="rounded-2xl bg-surface-soft p-7">
                <Icon className="h-6 w-6 text-terracotta" strokeWidth={2} />
                {item.title && (
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
