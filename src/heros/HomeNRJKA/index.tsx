import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

import type { Page } from '@/payload-types'

type HeroProps = Page['hero']

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
  } = props || {}

  const statList = stats || []

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            {badge && (
              <span className="mb-6 inline-block animate-in fade-in slide-in-from-bottom-3 rounded-full bg-terracotta/15 px-4 py-1.5 text-sm font-medium text-terracotta-dark duration-700">
                {badge}
              </span>
            )}

            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-4 text-5xl font-bold leading-[1.05] tracking-tight text-ink duration-700 sm:text-6xl lg:text-7xl">
              {headline}
              {headlineAccent && (
                <>
                  <br />
                  <span className="text-gradient-brand">{headlineAccent}</span>
                </>
              )}
            </h1>

            {subtitle && (
              <p className="mb-8 max-w-xl animate-in fade-in text-lg leading-relaxed text-slate duration-1000">
                {subtitle}
              </p>
            )}

            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              {primaryCtaLabel && (
                <Link
                  href={primaryCtaHref || '#'}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-8 py-4 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-colors hover:bg-terracotta-dark"
                >
                  {primaryCtaLabel}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                </Link>
              )}
              {secondaryCtaLabel && (
                <Link
                  href={secondaryCtaHref || '#'}
                  className="inline-flex items-center justify-center rounded-xl border border-border px-8 py-4 font-medium text-ink transition-colors hover:bg-card"
                >
                  {secondaryCtaLabel}
                </Link>
              )}
            </div>

            {trustBadges && trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-4 text-sm text-slate">
                {trustBadges.map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-terracotta" strokeWidth={2.2} />
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid h-[600px] grid-cols-6 grid-rows-6 gap-4 animate-in fade-in slide-in-from-right-6 duration-1000">
            <div className="relative col-span-4 row-span-3 overflow-hidden rounded-3xl bg-brand p-6 text-brand-foreground shadow-soft">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="text-5xl font-bold">{statList[0]?.value}</div>
                    <div className="text-white/70">{statList[0]?.label}</div>
                  </div>
                  <Sparkles className="h-6 w-6 text-white/60" />
                </div>
                <div className="mt-auto flex items-center gap-2 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Disponible pour de nouveaux projets
                </div>
              </div>
            </div>

            <div className="col-span-2 row-span-2 flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="text-4xl font-bold text-ink">{statList[1]?.value}</div>
              <div className="text-sm text-slate">{statList[1]?.label}</div>
            </div>

            <div className="col-span-3 row-span-3 flex flex-col justify-end rounded-3xl bg-brand-2 p-8 text-brand-foreground shadow-soft">
              <Sparkles className="mb-3 h-6 w-6 text-terracotta" />
              <p className="text-sm text-white/80">Performance technique + intelligence humaine</p>
            </div>

            <div className="col-span-3 row-span-1 flex items-center justify-center rounded-3xl bg-surface-soft text-sm font-medium text-ink">
              ✨ Open Source
            </div>

            <div className="col-span-2 row-span-4 flex flex-col items-center justify-center rounded-3xl border border-brand/10 bg-card p-6 text-center shadow-sm">
              <div className="mb-2 text-5xl font-bold text-ink">{statList[2]?.value}</div>
              <div className="text-sm text-slate">{statList[2]?.label}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}