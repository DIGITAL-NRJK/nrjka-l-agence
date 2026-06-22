import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer({ locale = 'fr' }: { locale?: string }) {
  const footerData: Footer = await getCachedGlobal('footer', 1, locale)()
  const navItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-white/10 bg-brand text-white">
      <div className="container py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href={`/${locale}`} className="text-white">
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {locale === 'en'
                ? 'Human digital agency — websites, SEO, automation and CRM, for sustainable growth.'
                : 'Agence digitale humaine — sites web, SEO, automatisation et CRM, pour une croissance durable.'}
            </p>
          </div>

          {navItems.length > 0 && (
            <nav className="flex flex-wrap gap-x-12 gap-y-3">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  locale={locale}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                />
              ))}
            </nav>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} NRJKA. {locale === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</span>
          <div className="flex gap-6">
            <Link href={`/${locale}/mentions-legales`} className="transition-colors hover:text-white/80">
              {locale === 'en' ? 'Legal notice' : 'Mentions légales'}
            </Link>
            <Link href={`/${locale}/confidentialite`} className="transition-colors hover:text-white/80">
              {locale === 'en' ? 'Privacy policy' : 'Confidentialité'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
