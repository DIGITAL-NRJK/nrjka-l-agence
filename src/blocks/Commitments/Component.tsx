import React from 'react'

import type { CommitmentsBlock as CommitmentsBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

const commitmentsCss = `
@keyframes cm-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@supports (animation-timeline: view()) {
  .cm-track{view-timeline-name:--charte}
  .cm-item{animation:cm-rise .5s ease-out both;animation-timeline:--charte;animation-range:entry 0% entry 35%}
  .cm-item:nth-child(2){animation-range:entry 5% entry 40%}
  .cm-item:nth-child(3){animation-range:entry 10% entry 45%}
  .cm-item:nth-child(4){animation-range:entry 15% entry 50%}
  .cm-item:nth-child(5){animation-range:entry 20% entry 55%}
  .cm-item:nth-child(6){animation-range:entry 25% entry 60%}
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
    <section className="container" style={bgStyle(a.background)}>
      <style dangerouslySetInnerHTML={{ __html: commitmentsCss }} />
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

      {list.length > 0 && (
        <ol className="cm-track mt-14 border-t border-border">
          {list.map((item, i) => (
            <li
              key={i}
              className="cm-item group grid gap-3 border-b border-border py-8 transition-colors lg:grid-cols-[0.42fr_0.58fr] lg:gap-12"
            >
              <div>
                {item.keyword && (
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-dark">
                    {item.keyword}
                  </span>
                )}
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug tracking-tight text-ink">
                  {item.title}
                </h3>
              </div>
              {item.description && (
                <p className="leading-relaxed text-slate lg:self-center">{item.description}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
