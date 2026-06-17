'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Database,
  Globe,
  MessageSquare,
  Palette,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export type MegaMenuService = {
  title: string
  description?: string | null
  href: string
}

export type MegaMenuPole = {
  id: string
  title: string
  subtitle?: string | null
  icon?: string | null
  href: string
  services: MegaMenuService[]
}

export type MegaMenuChrome = {
  triggerLabel?: string | null
  railLabel?: string | null
  ctaPrimaryLabel?: string | null
  ctaPrimaryHref?: string | null
  ctaSecondaryLabel?: string | null
  ctaSecondaryHref?: string | null
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Palette,
  Globe,
  TrendingUp,
  Database,
}

export const MegaMenu: React.FC<{
  poles: MegaMenuPole[]
  chrome?: MegaMenuChrome
  onNavigate?: () => void
}> = ({ poles, chrome, onNavigate }) => {
  const railLabel = chrome?.railLabel || 'Pôles principaux'
  const cta1Label = chrome?.ctaPrimaryLabel || 'Démarrer un projet'
  const cta1Href = chrome?.ctaPrimaryHref || '/contact'
  const cta2Label = chrome?.ctaSecondaryLabel || 'Parler à un expert'
  const cta2Href = chrome?.ctaSecondaryHref || '/contact'
  const [active, setActive] = useState(0)
  if (poles.length === 0) return null
  const pole = poles[Math.min(active, poles.length - 1)]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <div className="grid sm:grid-cols-[minmax(13rem,17rem)_1fr]">
        {/* Rail des pôles */}
        <div className="border-border bg-surface-soft p-3 sm:border-r">
          <div className="px-3 pb-2 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate">
            {railLabel}
          </div>
          <ul className="space-y-1">
            {poles.map((p, i) => {
              const Icon = (p.icon && iconMap[p.icon]) || Sparkles
              const isActive = i === active
              return (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      isActive ? 'bg-brand text-white' : 'text-ink hover:bg-background'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${isActive ? 'text-terracotta' : 'text-slate'}`}
                      strokeWidth={2}
                    />
                    <span className="flex-1 font-medium leading-tight">{p.title}</span>
                    {isActive && <ArrowRight className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2.2} />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Détail du pôle actif */}
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">{pole.title}</h3>
          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {pole.services.map((s, i) => (
              <Link key={i} href={s.href} onClick={onNavigate} className="group block">
                <div className="font-semibold text-ink transition-colors group-hover:text-terracotta-dark">
                  {s.title}
                </div>
                {s.description && (
                  <div className="mt-0.5 line-clamp-1 text-sm text-slate">{s.description}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2">
        <Link
          href={cta2Href}
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
        >
          <MessageSquare className="h-4 w-4 text-slate" strokeWidth={2} />
          {cta2Label}
          <ArrowRight className="h-4 w-4 text-slate" strokeWidth={2.2} />
        </Link>
        <Link
          href={cta1Href}
          onClick={onNavigate}
          className="group flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-2"
        >
          {cta1Label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  )
}
