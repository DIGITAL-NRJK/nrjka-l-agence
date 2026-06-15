import React from 'react'

import { bgStyle, type Appearance } from '@/utilities/appearance'

type Stat = { value?: string | null; label?: string | null; id?: string | null }

export type StatsBandProps = {
  items?: Stat[] | null
  appearance?: Appearance | null
}

export const StatsBandBlock: React.FC<StatsBandProps> = ({ items, appearance }) => {
  const a = appearance || {}
  const list = (items || []).filter((s) => s?.value || s?.label)
  if (list.length === 0) return null

  return (
    <section className="bg-surface-soft py-14 sm:py-16" style={bgStyle(a.background)}>
      <div className="container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((stat, i) => (
            <div key={i}>
              {stat.value && (
                <div className="font-display text-4xl font-bold leading-none tracking-tight text-ink">
                  {stat.value}
                </div>
              )}
              {stat.label && (
                <div className="mt-3 text-sm leading-relaxed text-slate">{stat.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
