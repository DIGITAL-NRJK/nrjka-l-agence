import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import type { MegaMenuPole, MegaMenuService } from './Nav/MegaMenu'

type PoleRow = {
  pole?: unknown
  labelOverride?: string | null
  services?: { service?: unknown; labelOverride?: string | null }[] | null
}

const asDoc = (v: unknown): { id?: unknown; title?: string; slug?: string; icon?: string | null; description?: string | null } | null =>
  v && typeof v === 'object' ? (v as any) : null

export async function Header({ locale = 'fr' }: { locale?: string }) {
  // depth 2 : peuple les relations pôle/service du méga-menu (pour récupérer titre, slug, icône…).
  const headerData: Header = await getCachedGlobal('header', 2, locale)()

  // Le méga-menu est piloté depuis le global Header : on choisit des pôles/services
  // existants (relations) + un renommage optionnel ; lien/icône/description sont dérivés.
  const mm = (headerData as { megamenu?: { poles?: PoleRow[] } }).megamenu
  const menu: MegaMenuPole[] = []
  for (const [i, row] of (mm?.poles || []).entries()) {
    const pole = asDoc(row?.pole)
    if (!pole) continue
    const services: MegaMenuService[] = []
    for (const sRow of row?.services || []) {
      const svc = asDoc(sRow?.service)
      if (!svc) continue
      const svcAny = svc as any
      const svcTitle = locale === 'en' ? (svcAny.title_en || svc.title || '') : (svc.title || '')
      const svcDesc  = locale === 'en' ? (svcAny.description_en ?? svc.description ?? null) : (svc.description ?? null)
      services.push({
        title: sRow.labelOverride || svcTitle,
        description: svcDesc,
        href: svc.slug ? `/${locale}/services/${svc.slug}` : '#',
      })
    }
    menu.push({
      id: String(pole.id ?? i),
      title: row.labelOverride || pole.title || '',
      subtitle: null,
      icon: pole.icon ?? null,
      href: pole.slug ? `/${locale}/expertises/${pole.slug}` : '#',
      services,
    })
  }

  const chrome = (headerData as { megamenu?: Record<string, unknown> }).megamenu

  return <HeaderClient data={headerData} menu={menu} chrome={chrome} locale={locale} />
}
