'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MegaMenu, type MegaMenuPole } from './MegaMenu'

export const HeaderNav: React.FC<{ data: HeaderType; menu?: MegaMenuPole[] }> = ({
  data,
  menu = [],
}) => {
  const navItems = data?.navItems || []
  const hasMenu = menu.length > 0
  const [open, setOpen] = useState(false) // burger mobile
  const [mega, setMega] = useState(false) // mégamenu desktop
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
    setMega(false)
  }, [pathname])

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMega(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMega(false), 120)
  }

  return (
    <nav className="flex items-center gap-7">
      {/* Liens — desktop */}
      <div className="hidden items-center gap-7 md:flex">
        {hasMenu && (
          <div onMouseEnter={openMega} onMouseLeave={scheduleClose}>
            <button
              type="button"
              onClick={() => setMega((v) => !v)}
              aria-expanded={mega}
              className="flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              Services
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mega ? 'rotate-180' : ''}`}
                strokeWidth={2.2}
              />
            </button>
          </div>
        )}
        {navItems.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="text-sm font-medium text-slate transition-colors hover:text-ink"
          />
        ))}
      </div>

      {/* Panneau mégamenu — desktop, positionné sous le header, centré */}
      {hasMenu && (
        <div
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
          className={`fixed left-1/2 top-[4.5rem] z-50 hidden w-[min(60rem,calc(100vw-1.5rem))] -translate-x-1/2 md:block ${
            mega ? 'pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          } transition-all duration-200`}
        >
          <MegaMenu poles={menu} onNavigate={() => setMega(false)} />
        </div>
      )}

      {/* CTA — toujours visible */}
      <a
        href="/contact"
        className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
      >
        Demander un audit
      </a>

      {/* Burger — mobile */}
      {(navItems.length > 0 || hasMenu) && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-soft md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Panneau mobile */}
      {(navItems.length > 0 || hasMenu) && (
        <div
          id="mobile-nav"
          className={`absolute left-0 right-0 top-full md:hidden ${
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          } transition-all duration-200`}
        >
          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
            {hasMenu && (
              <div className="border-b border-border p-2">
                <div className="px-4 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate">
                  Nos pôles
                </div>
                <ul>
                  {menu.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={p.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-4 py-2.5 text-base font-medium text-ink transition-colors hover:bg-surface-soft"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {navItems.length > 0 && (
              <ul className="flex flex-col p-2">
                {navItems.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      appearance="link"
                      className="block rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-surface-soft"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
