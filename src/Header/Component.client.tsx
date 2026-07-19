'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import type { MegaMenuPole, MegaMenuChrome } from './Nav/MegaMenu'

interface HeaderClientProps {
  data: Header
  menu?: MegaMenuPole[]
  chrome?: MegaMenuChrome
  locale?: string
  /** false = version anglaise désactivée dans l'admin → pas de sélecteur de langue. */
  showLanguageSwitcher?: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  menu,
  chrome,
  locale = 'fr',
  showLanguageSwitcher = true,
}) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky z-50 border-b border-border bg-background/85 backdrop-blur-md"
      style={{ top: 'var(--promo-offset, 0px)' }}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container relative">
        <div className="flex items-center justify-between py-4">
          <Link href={`/${locale}`} className="text-brand dark:text-white">
            <Logo />
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <HeaderNav data={data} menu={menu} chrome={chrome} locale={locale} />
            {showLanguageSwitcher && (
              <div className="shrink-0">
                <LanguageSwitcher />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
