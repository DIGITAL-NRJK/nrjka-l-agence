import React from 'react'
import { Heart } from 'lucide-react'

import type { PromiseBlock as PromiseBlockProps } from '@/payload-types'
import { iconMap } from '@/utilities/icons'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

export const PromiseBlock: React.FC<PromiseBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  description,
  features,
  commitment,
  appearance,
}) => {
  const a = appearance || {}

  return (
    <section
      className="relative overflow-hidden bg-brand py-14 sm:py-16"
      style={bgStyle(a.background)}
    >
      {/* trame — écho de la carte D4 du Hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container">
        <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Colonne gauche — le discours */}
          <div>
            {eyebrow && (
              <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                <span className="h-px w-8 bg-terracotta" />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                className={`${titleClass(a, 'text-3xl sm:text-4xl')} font-bold leading-[1.1] tracking-tight text-white`}
                style={colorStyle(a.titleColor)}
              >
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-4 text-lg font-medium text-terracotta">{subtitle}</p>}
            {description && (
              <p
                className={`${textClass(a)} mt-4 leading-relaxed text-white/70`}
                style={colorStyle(a.textColor)}
              >
                {description}
              </p>
            )}
            {commitment && (
              <div className="mt-8 flex items-center gap-3">
                <Heart className="h-5 w-5 shrink-0 text-terracotta" strokeWidth={2.2} />
                <p className="font-semibold text-white">{commitment}</p>
              </div>
            )}
          </div>

          {/* Colonne droite — 4 valeurs en 2×2 */}
          {features && features.length > 0 && (
            <div className="grid content-center gap-x-10 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
              {features.map((feature, i) => {
                const Icon = iconMap[feature.icon || 'userCheck'] || Heart
                return (
                  <div key={i} className="group flex gap-4">
                    <Icon
                      className="h-6 w-6 shrink-0 text-terracotta transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={2}
                    />
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
