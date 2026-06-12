import React from 'react'

import type { MethodBlock as MethodBlockProps } from '@/payload-types'

const methodCss = `
@keyframes md-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
@keyframes md-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes md-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@supports (animation-timeline: view()) {
  .md-track{view-timeline-name:--method}
  .md-node{animation:md-pop .5s ease-out both;animation-timeline:--method;animation-range:entry 0% entry 30%}
  .md-line{transform-origin:left;animation:md-draw .5s ease-out both;animation-timeline:--method;animation-range:entry 5% entry 40%}
  .md-body{animation:md-rise .5s ease-out both;animation-timeline:--method;animation-range:entry 5% entry 35%}
  .md-step:nth-child(2) .md-node{animation-range:entry 10% entry 40%}
  .md-step:nth-child(2) .md-line{animation-range:entry 15% entry 50%}
  .md-step:nth-child(2) .md-body{animation-range:entry 15% entry 45%}
  .md-step:nth-child(3) .md-node{animation-range:entry 20% entry 50%}
  .md-step:nth-child(3) .md-line{animation-range:entry 25% entry 60%}
  .md-step:nth-child(3) .md-body{animation-range:entry 25% entry 55%}
  .md-step:nth-child(4) .md-node{animation-range:entry 30% entry 60%}
  .md-step:nth-child(4) .md-body{animation-range:entry 35% entry 65%}
}
@media (prefers-reduced-motion:reduce){.md-node,.md-line,.md-body{animation:none}}
`
export const MethodBlock: React.FC<MethodBlockProps> = ({ eyebrow, title, intro, steps }) => {
  const list = steps || []

  return (
    <section className="container">
      <style dangerouslySetInnerHTML={{ __html: methodCss }} />
      {/* En-tête */}
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </span>
        )}
        {title && (
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {title}
          </h2>
        )}
        {intro && <p className="mt-5 text-lg leading-relaxed text-slate">{intro}</p>}
      </div>

      {/* Parcours en 4 temps */}
      {list.length > 0 && (
        <ol className="md-track mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((step, i) => {
            const activities = (step.activities || []).map((a) => a.label).filter(Boolean)
            return (
              <li key={i} className="md-step group relative">
                {/* fil de liaison (desktop, sauf le dernier) */}
                {i < list.length - 1 && (
                  <span className="md-line absolute left-14 -right-8 top-7 hidden h-px -translate-y-1/2 bg-linear-to-r from-terracotta via-terracotta/40 to-border lg:block" />
                )}
                {/* nœud numéroté */}
                <span className="md-node relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-terracotta/50 bg-background font-display text-lg font-bold text-terracotta transition-colors group-hover:border-terracotta group-hover:bg-terracotta/5">
                  {`0${i + 1}`}
                </span>
                <div className="md-body">
                  <h3 className="mt-6 text-2xl font-semibold text-ink">
                    {step.title ? (
                      <>
                        <span className="text-terracotta-dark">{step.title.charAt(0)}</span>
                        {step.title.slice(1)}
                      </>
                    ) : null}
                  </h3>
                  {step.tagline && (
                    <p className="mt-1 text-sm font-medium uppercase tracking-[0.08em] text-terracotta">
                      {step.tagline}
                    </p>
                  )}
                  {activities.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {activities.map((a, j) => (
                        <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
