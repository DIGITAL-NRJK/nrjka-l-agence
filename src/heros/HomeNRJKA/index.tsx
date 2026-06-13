import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

import type { Page } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

type HeroProps = Page['hero']

const defaultDimensions = [
  { title: 'Diagnostic', tag: 'Comprendre la complexité' },
  { title: 'Design', tag: 'Dessiner la clarté' },
  { title: 'Développement', tag: "Construire l'excellence" },
  { title: 'Durabilité', tag: 'Faire durer la croissance' },
]

export const HomeNRJKAHero: React.FC<HeroProps> = (props) => {
  const {
    badge,
    headline,
    headlineAccent,
    subtitle,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    trustBadges,
    stats,
    panelDimensions,
    panelAvailability,
    appearance,
  } = props || {}
  const a = appearance || {}
  const statList = stats || []
  const dims = panelDimensions && panelDimensions.length > 0 ? panelDimensions : defaultDimensions

  return (
    <section
      className="relative flex min-h-[80vh] items-center overflow-hidden bg-background"
      style={bgStyle(a.background)}
    >
      <div className="relative mx-auto grid w-full max-w-7xl items-start gap-16 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-16 lg:py-16">
        {/* Colonne gauche */}
        <div>
          {badge && (
            <span className="mb-7 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="h-px w-8 bg-terracotta" />
              {badge}
            </span>
          )}

          <h1
            className={`${titleClass(a, 'text-4xl sm:text-5xl lg:text-6xl')} font-bold leading-[1.05] tracking-tight text-ink animate-in fade-in slide-in-from-bottom-4 duration-700`}
            style={colorStyle(a.titleColor)}
          >
            {headline}
            {headlineAccent && (
              <>
                <br />
                <span className="relative inline-block whitespace-nowrap text-terracotta-dark">
                  {headlineAccent}
                  <svg
                    className="absolute -bottom-1 left-0 h-2 w-full text-terracotta/60"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      className="animate-draw"
                      d="M1 5.5 C 50 1, 150 1, 199 5.5"
                      pathLength={1}
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </>
            )}
          </h1>

          {subtitle && (
            <p
              className={`${textClass(a, 'text-lg')} mt-7 max-w-lg leading-relaxed text-slate animate-in fade-in duration-1000`}
              style={colorStyle(a.textColor)}
            >
              {subtitle}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {primaryCtaLabel && (
              <Link
                href={primaryCtaHref || '#'}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-xl hover:shadow-terracotta/30"
              >
                {primaryCtaLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
            )}
            {secondaryCtaLabel && (
              <Link
                href={secondaryCtaHref || '#'}
                className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 font-medium text-ink transition-colors hover:border-brand/30 hover:bg-card"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Colonne droite : panneau Architecture D4™ */}
        <div className="relative animate-in fade-in slide-in-from-right-6 duration-1000">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand p-8 shadow-soft">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-terracotta/20 blur-3xl" />

            <div className="relative">
              <div className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                {panelEyebrow || 'Architecture D4™'}
              </div>
              <div className="mb-7 text-lg font-semibold text-white">
                {panelTitle || 'De la complexité à la clarté'}
              </div>

              <ul className="grid grid-cols-2 gap-2">
                {dims.map((dim, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl px-2.5 py-3 transition-colors hover:bg-white/5"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold text-terracotta">
                      {`0${i + 1}`}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{dim.title}</div>
                      <div className="text-sm text-white/55">{dim.tag}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {panelAvailability || 'Disponible pour de nouveaux projets'}
              </div>
            </div>
          </div>
          {trustBadges && trustBadges.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate">
              {trustBadges.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-terracotta" strokeWidth={2.4} />
                  {item.label}
                </span>
              ))}
            </div>
          )}
          {statList[0] && (
            <div className="glass-card absolute -left-5 top-12 rounded-2xl px-5 py-4 shadow-soft">
              <div className="text-2xl font-bold text-ink">{statList[0]?.value}</div>
              <div className="text-xs text-slate">{statList[0]?.label}</div>
            </div>
          )}
          {statList[1] && (
            <div className="glass-card absolute -right-4 bottom-10 rounded-2xl px-5 py-4 shadow-soft">
              <div className="text-2xl font-bold text-ink">{statList[1]?.value}</div>
              <div className="text-xs text-slate">{statList[1]?.label}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
