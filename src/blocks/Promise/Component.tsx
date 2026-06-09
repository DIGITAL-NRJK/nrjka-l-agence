import React from 'react'
import { UserCheck, Layers, Shield, Zap, Heart, Target } from 'lucide-react'

import type { PromiseBlock as PromiseBlockProps } from '@/payload-types'

const iconMap = {
  userCheck: UserCheck,
  layers: Layers,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  target: Target,
}

export const PromiseBlock: React.FC<PromiseBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  description,
  features,
  commitment,
}) => {
  return (
    <section className="container">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow && (
          <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
            <span className="h-px w-8 bg-terracotta" />
          </span>
        )}
        {title && (
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
        {subtitle && <p className="mt-4 text-lg font-medium text-terracotta-dark">{subtitle}</p>}
        {description && <p className="mt-4 text-lg leading-relaxed text-slate">{description}</p>}
      </div>

      {features && features.length > 0 && (
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon || 'userCheck'] || UserCheck
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-7 shadow-soft transition-transform hover:-translate-y-1"
              >
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="leading-relaxed text-slate">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {commitment && (
        <div className="mx-auto mt-12 flex max-w-3xl items-center justify-center gap-3 rounded-2xl bg-brand px-8 py-6 text-center shadow-soft">
          <Heart className="h-5 w-5 shrink-0 text-terracotta" strokeWidth={2.2} />
          <p className="text-lg font-semibold text-white">{commitment}</p>
        </div>
      )}
    </section>
  )
}
