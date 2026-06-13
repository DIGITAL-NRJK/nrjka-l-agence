'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Referme le menu à chaque changement de page
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <nav className="flex items-center gap-7">
      {/* Liens — desktop */}
      <div className="hidden items-center gap-7 md:flex">
        {navItems.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="text-sm font-medium text-slate transition-colors hover:text-ink"
          />
        ))}
      </div>

      {/* CTA — toujours visible */}
      <a
        href="/contact"
        className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
      >
        Demander un audit
      </a>

      {/* Burger — mobile uniquement, seulement s'il y a des liens */}
      {navItems.length > 0 && (
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
      {navItems.length > 0 && (
        <div
          id="mobile-nav"
          className={`absolute left-0 right-0 top-full md:hidden ${
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          } transition-all duration-200`}
        >
          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
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
          </div>
        </div>
      )}
    </nav>
  )
}
