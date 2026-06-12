'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-7">
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
      <a
        href="/contact"
        className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
      >
        Demander un audit
      </a>
    </nav>
  )
}
