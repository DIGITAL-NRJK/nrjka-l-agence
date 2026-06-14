import React from 'react'

import type { CommitmentsBlock as CommitmentsBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

const commitmentsCss = `
@keyframes cm-rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.cm-item{opacity:0;animation:cm-rise .6s ease-out forwards;animation-delay:calc(var(--cm-i) * 90ms)}
@supports (animation-timeline: view()) {
  .cm-grid{view-timeline-name:--charte}
  .cm-item{opacity:1;animation:cm-rise .6s ease-out both;animation-timeline:--charte;animation-range:entry 0% cover 22%;animation-delay:0s}
}
@media (prefers-reduced-motion:reduce){.cm-item{opacity:1;animation:none}}
`

export const CommitmentsBlock: React.FC<CommitmentsBlockProps> = ({
  eyebrow,
  title,
  intro,
  commitments,
  appearance,
}) => {
  const list = commitments || []
  const a = appearance || {}

  return (
    <section
      className="relative overflow-hidden bg-brand py-16 text-white sm:py-20"
      style={bgStyle(a.background)}
    >
      <style dangerouslySetInnerHTML={{ __html: commitmentsCss }} />
      {/* trame + halo discrets */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-terracotta/10 blur-[120px]" />

      <div className="container relative">
        <div className="max-w-3xl">
          {eyebrow && (
            <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-terracotta">
              <span className="h-px w-8 bg-terracotta" />
              {eyebrow}
            </span>
          )}
          {title && (
            <h2
              className={`${titleClass(a, 'text-3xl sm:text-4xl lg:text-5xl')} font-display font-bold leading-[1.05] tracking-tight text-white`}
              style={colorStyle(a.titleColor)}
            >
              {title}
            </h2>
          )}
          {intro && (
            <p
              className={`${textClass(a, 'text-lg')} mt-5 leading-relaxed text-white/65`}
              style={colorStyle(a.textColor)}
            >
              {intro}
            </p>
          )}
        </div>

        {list.length > 0 && (
          <div className="cm-grid mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item, i) => (
              <div
                key={i}
                className="cm-item group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:bg-white/[0.06]"
                style={{ '--cm-i': i } as React.CSSProperties}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold leading-none text-terracotta">
                    {`0${i + 1}`}
                  </span>
                  {item.keyword && (
                    <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/40">
                      {item.keyword}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-white">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
