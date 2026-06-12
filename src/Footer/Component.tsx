import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-brand text-white">
      <div className="container py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="text-white">
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Agence digitale humaine — sites web, SEO, automatisation et CRM, pour une croissance
              durable.
            </p>
          </div>

          {navItems.length > 0 && (
            <nav className="flex flex-wrap gap-x-12 gap-y-3">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                />
              ))}
            </nav>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} NRJKA. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="transition-colors hover:text-white/80">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-white/80">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
