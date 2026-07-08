'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { localizeHref } from '@/utilities/localizeHref'
import { MegaMenu, type MegaMenuPole, type MegaMenuChrome } from './MegaMenu'

type NavItemT = NonNullable<HeaderType['navItems']>[number]
type NavLinkT = NavItemT['link']

/** Menu déroulant desktop pour un item de nav qui a des sous-liens. */
const NavDropdown: React.FC<{ label: string; items: { link: NavLinkT }[]; locale: string }> = ({
  label,
  items,
  locale,
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onOutside = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (ref.current && t && !ref.current.contains(t)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
    }
  }, [open])

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={openNow} onMouseLeave={scheduleClose}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-ink"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2.2}
        />
      </button>
      <div
        className={`absolute left-0 top-full z-50 pt-3 ${
          open ? 'visible opacity-100' : 'invisible pointer-events-none -translate-y-1 opacity-0'
        } transition-all duration-200`}
      >
        <ul className="min-w-[12rem] overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-soft">
          {items.map((sub, i) => (
            <li key={i}>
              <CMSLink
                {...sub.link}
                locale={locale}
                appearance="link"
                className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const HeaderNav: React.FC<{
  data: HeaderType
  menu?: MegaMenuPole[]
  chrome?: MegaMenuChrome
  locale?: string
}> = ({ data, menu = [], chrome: rawChrome, locale = 'fr' }) => {
  const navItems = data?.navItems || []
  // Les CTAs du mégamenu viennent du CMS (ex. « /contact ») : on les préfixe avec la
  // locale pour éviter la redirection 308 du middleware à chaque clic/crawl.
  const chrome = rawChrome
    ? {
        ...rawChrome,
        ctaPrimaryHref: localizeHref(rawChrome.ctaPrimaryHref, locale),
        ctaSecondaryHref: localizeHref(rawChrome.ctaSecondaryHref, locale),
      }
    : rawChrome
  const hasMenu = menu.length > 0
  const [open, setOpen] = useState(false) // burger mobile
  const [mega, setMega] = useState(false) // mégamenu desktop
  const [openPole, setOpenPole] = useState<string | null>(null) // accordéon pôle (mobile)
  const [openMobileNav, setOpenMobileNav] = useState<number | null>(null) // accordéon sous-liens (mobile)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
    setMega(false)
  }, [pathname])

  // Accessibilité clavier du mégamenu : Échap ferme (et rend le focus au déclencheur),
  // un clic ou un focus en dehors le ferme aussi.
  useEffect(() => {
    if (!mega) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false)
        triggerRef.current?.focus()
      }
    }
    const onOutside = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (t && !t.closest('[data-mega]')) setMega(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('focusin', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [mega])

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMega(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMega(false), 120)
  }

  return (
    <nav className="flex items-center gap-2 md:gap-7">
      {/* Liens — desktop. Le déclencheur « Services » est inséré à la position choisie en admin. */}
      <div className="hidden items-center gap-7 md:flex">
        {(() => {
          const links = navItems.map((item, i) => {
            const subItems =
              (item as unknown as { subItems?: { link: NavLinkT }[] }).subItems || []
            if (subItems.length > 0) {
              return (
                <NavDropdown
                  key={`nav-${i}`}
                  label={item.link?.label || ''}
                  items={subItems}
                  locale={locale}
                />
              )
            }
            return (
              <CMSLink
                key={`nav-${i}`}
                {...item.link}
                locale={locale}
                appearance="link"
                className="text-sm font-medium text-slate transition-colors hover:text-ink"
              />
            )
          })

          if (hasMenu) {
            const trigger = (
              <div key="services" data-mega onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setMega((v) => !v)}
                  aria-expanded={mega}
                  aria-haspopup="true"
                  aria-controls="mega-panel"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-ink"
                >
                  {chrome?.triggerLabel || 'Services'}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mega ? 'rotate-180' : ''}`}
                    strokeWidth={2.2}
                  />
                </button>
              </div>
            )
            const navPosition =
              (data?.megamenu as { navPosition?: number | null } | null | undefined)?.navPosition ||
              1
            const pos = Math.min(Math.max(navPosition - 1, 0), links.length)
            links.splice(pos, 0, trigger)
          }

          return links
        })()}
      </div>

      {/* Panneau mégamenu — desktop, positionné sous le header, centré */}
      {hasMenu && (
        <div
          id="mega-panel"
          data-mega
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
          className={`fixed left-1/2 top-[4rem] z-50 hidden w-[min(60rem,calc(100vw-1.5rem))] -translate-x-1/2 md:block ${
            mega
              ? 'visible pointer-events-auto opacity-100'
              : 'invisible pointer-events-none -translate-y-1 opacity-0'
          } transition-all duration-200`}
        >
          <MegaMenu poles={menu} chrome={chrome} onNavigate={() => setMega(false)} />
        </div>
      )}

      {/* Bascule thème — desktop */}
      <ThemeToggle className="hidden md:flex" />

      {/* CTA — toujours visible ; compact sur mobile pour ne pas déborder ni passer à la ligne */}
      <a
        href={`/${locale}/demander-un-audit`}
        className="shrink-0 whitespace-nowrap rounded-full bg-terracotta px-3 py-1.5 text-xs font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark sm:px-5 sm:py-2 sm:text-sm"
      >
        {locale === 'en' ? 'Request an audit' : 'Demander un audit'}
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
            open
              ? 'visible pointer-events-auto opacity-100'
              : 'invisible pointer-events-none -translate-y-2 opacity-0'
          } transition-all duration-200`}
        >
          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
            {hasMenu && (
              <div className="border-b border-border p-2">
                <div className="px-4 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate">
                  Nos pôles
                </div>
                <ul>
                  {menu.map((p) => {
                    const expanded = openPole === p.id
                    const hasServices = p.services.length > 0
                    return (
                      <li key={p.id}>
                        <div className="flex items-center">
                          <Link
                            href={p.href}
                            onClick={() => setOpen(false)}
                            className="flex-1 rounded-xl px-4 py-2.5 text-base font-medium text-ink transition-colors hover:bg-surface-soft"
                          >
                            {p.title}
                          </Link>
                          {hasServices && (
                            <button
                              type="button"
                              onClick={() => setOpenPole(expanded ? null : p.id)}
                              aria-expanded={expanded}
                              aria-label={
                                expanded
                                  ? `Masquer les services de ${p.title}`
                                  : `Voir les services de ${p.title}`
                              }
                              className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate transition-colors hover:bg-surface-soft hover:text-ink"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                strokeWidth={2.2}
                              />
                            </button>
                          )}
                        </div>
                        {hasServices && expanded && (
                          <ul className="mb-1 ml-3 border-l border-border pl-3">
                            {p.services.map((s, si) => (
                              <li key={si}>
                                <Link
                                  href={s.href}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-slate transition-colors hover:bg-surface-soft hover:text-ink"
                                >
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {navItems.length > 0 && (
              <ul className="flex flex-col p-2">
                {navItems.map((item, i) => {
                  const subItems =
                    (item as unknown as { subItems?: { link: NavLinkT }[] }).subItems || []
                  if (subItems.length > 0) {
                    const expanded = openMobileNav === i
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setOpenMobileNav(expanded ? null : i)}
                          aria-expanded={expanded}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-surface-soft"
                        >
                          {item.link?.label}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                            strokeWidth={2.2}
                          />
                        </button>
                        {expanded && (
                          <ul className="mb-1 ml-3 border-l border-border pl-3">
                            {subItems.map((sub, si) => (
                              <li key={si}>
                                <CMSLink
                                  {...sub.link}
                                  locale={locale}
                                  appearance="link"
                                  className="block rounded-lg px-3 py-2 text-sm text-slate transition-colors hover:bg-surface-soft hover:text-ink"
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  }
                  return (
                    <li key={i}>
                      <CMSLink
                        {...item.link}
                        locale={locale}
                        appearance="link"
                        className="block rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-surface-soft"
                      />
                    </li>
                  )
                })}
              </ul>
            )}
            {/* Bascule thème — mobile */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2">
              <span className="text-sm font-medium text-slate">Apparence</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
