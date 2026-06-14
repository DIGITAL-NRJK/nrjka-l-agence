import React from 'react'

import type { CommitmentsBlock as CommitmentsBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

const commitmentsCss = `
@keyframes cm-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@supports (animation-timeline: view()) {
  .cm-track{view-timeline-name:--charte}
  .cm-item{animation:cm-rise .6s ease-out both;animation-timeline:--charte;animation-range:entry 0% entry 40%}
  .cm-item:nth-child(2){animation-range:entry 5% entry 45%}
  .cm-item:nth-child(3){animation-range:entry 10% entry 50%}
  .cm-item:nth-child(4){animation-range:entry 15% entry 55%}
  .cm-item:nth-child(5){animation-range:entry 20% entry 60%}
  .cm-item:nth-child(6){animation-range:entry 25% entry 65%}
}
@media (prefers-reduced-motion:reduce){.cm-item{animation:none}}
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
      className="relative overflow-hidden bg-brand py-20 text-white sm:py-28"
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
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-terracotta/10 blur-[120px]" />

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
              className={`${titleClass(a, 'text-4xl sm:text-5xl')} font-display font-bold leading-[1.05] tracking-tight text-white`}
              style={colorStyle(a.titleColor)}
            >
              {title}
            </h2>
          )}
          {intro && (
            <p
              className={`${textClass(a, 'text-lg')} mt-6 leading-relaxed text-white/65`}
              style={colorStyle(a.textColor)}
            >
              {intro}
            </p>
          )}
        </div>

        {list.length > 0 && (
          <ol className="cm-track mt-16 border-t border-white/10">
            {list.map((item, i) => (
              <li
                key={i}
                className="cm-item grid gap-6 border-b border-white/10 py-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-5xl font-bold leading-none text-terracotta sm:text-6xl">
                    {`0${i + 1}`}
                  </span>
                  {item.keyword && (
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-white/40">
                      {item.keyword}
                    </span>
                  )}
                </div>
                <div className="lg:pt-1">
                  <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-4 max-w-xl leading-relaxed text-white/65">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
