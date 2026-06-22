'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LOCALES } from '@/utilities/i18n'

const LABELS: Record<string, string> = { fr: 'FR', en: 'EN' }

export const LanguageSwitcher: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()

  // Extract current locale from the pathname (first segment)
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = LOCALES.includes(segments[0] as (typeof LOCALES)[number])
    ? segments[0]
    : 'fr'

  const switchTo = (targetLocale: string) => {
    if (targetLocale === currentLocale) return
    // Replace the locale segment and keep the rest of the path
    const rest = segments.slice(1).join('/')
    router.push(`/${targetLocale}${rest ? `/${rest}` : ''}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5" aria-label="Changer de langue">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === currentLocale}
          className={[
            'rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
            locale === currentLocale
              ? 'bg-brand text-white'
              : 'text-slate hover:text-ink',
          ].join(' ')}
        >
          {LABELS[locale]}
        </button>
      ))}
    </div>
  )
}
