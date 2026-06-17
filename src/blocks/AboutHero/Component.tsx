import React from 'react'

import { bgStyle, colorStyle, titleClass, textClass, type Appearance } from '@/utilities/appearance'

type Chip = { value?: string | null; label?: string | null; id?: string | null }

export type AboutHeroProps = {
  badge?: string | null
  title?: string | null
  titleAccent?: string | null
  subtitle?: string | null
  chips?: Chip[] | null
  appearance?: Appearance | null
}

export const AboutHeroBlock: React.FC<AboutHeroProps> = ({
  badge,
  title,
  titleAccent,
  subtitle,
  chips,
  appearance,
}) => {
  const a = appearance || {}
  const chipList = (chips || []).filter((c) => c?.value || c?.label)

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="max-w-3xl">
        {badge && (
          <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {badge}
          </span>
        )}

        {title && (
          <h1
            className={`${titleClass(a, 'text-4xl sm:text-5xl lg:text-6xl')} font-display font-bold leading-[1.05] tracking-tight text-ink`}
            style={colorStyle(a.titleColor)}
          >
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-terracotta-dark">{titleAccent}</span>
              </>
            )}
          </h1>
        )}

        {subtitle && (
          <p
            className={`${textClass(a, 'text-lg')} mt-6 max-w-2xl leading-relaxed text-slate`}
            style={colorStyle(a.textColor)}
          >
            {subtitle}
          </p>
        )}

        {chipList.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-4">
            {chipList.map((chip, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card px-5 py-4 shadow-soft">
                {chip.value && (
                  <div className="font-display text-2xl font-bold leading-none text-ink">
                    {chip.value}
                  </div>
                )}
                {chip.label && <div className="mt-1.5 text-sm text-slate">{chip.label}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
