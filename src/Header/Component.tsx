import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Header } from '@/payload-types'
import type { MegaMenuPole } from './Nav/MegaMenu'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  let menu: MegaMenuPole[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const [polesRes, servicesRes] = await Promise.all([
      payload.find({
        collection: 'expertises',
        where: { published: { equals: true } },
        sort: 'order',
        limit: 20,
        depth: 0,
      }),
      payload.find({
        collection: 'services',
        where: { published: { equals: true } },
        sort: 'order',
        limit: 200,
        depth: 0,
      }),
    ])

    const servicesByPole: Record<string, { title: string; slug: string; description?: string | null }[]> =
      {}
    for (const s of servicesRes.docs as {
      title: string
      slug: string
      description?: string | null
      pole: unknown
    }[]) {
      const pid =
        s.pole && typeof s.pole === 'object' ? String((s.pole as { id: unknown }).id) : String(s.pole)
      ;(servicesByPole[pid] ||= []).push({ title: s.title, slug: s.slug, description: s.description })
    }

    menu = (polesRes.docs as { id: unknown; title: string; subtitle?: string | null; icon?: string | null; slug: string }[]).map(
      (p) => ({
        id: String(p.id),
        title: p.title,
        subtitle: p.subtitle ?? null,
        icon: p.icon ?? null,
        href: `/expertises/${p.slug}`,
        services: (servicesByPole[String(p.id)] || []).map((s) => ({
          title: s.title,
          description: s.description ?? null,
          href: `/services/${s.slug}`,
        })),
      }),
    )
  } catch {
    menu = []
  }

  return <HeaderClient data={headerData} menu={menu} />
}
