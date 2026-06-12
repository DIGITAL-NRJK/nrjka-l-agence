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
    <section className="relative overflow-hidden bg-brand py-16 sm:py-20">
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
        <div className="relative">
          {/* En-tête */}
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                <span className="h-px w-8 bg-terracotta" />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-4 text-lg font-medium text-terracotta">{subtitle}</p>}
            {description && (
              <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p>
            )}
          </div>

          {/* 4 valeurs */}
          {features && features.length > 0 && (
            <div className="mt-12 grid gap-x-10 gap-y-9 border-t border-white/10 pt-10 sm:grid-cols-2">
              {features.map((feature, i) => {
                const Icon = iconMap[feature.icon || 'userCheck'] || UserCheck
                return (
                  <div key={i} className="flex gap-4">
                    <Icon className="h-6 w-6 shrink-0 text-terracotta" strokeWidth={2} />
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

          {/* Engagement */}
          {commitment && (
            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-7">
              <Heart className="h-5 w-5 shrink-0 text-terracotta" strokeWidth={2.2} />
              <p className="font-semibold text-white">{commitment}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
