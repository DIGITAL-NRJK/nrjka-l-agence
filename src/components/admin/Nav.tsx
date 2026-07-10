import { DefaultNav } from '@payloadcms/next/rsc'
import React from 'react'

/**
 * Nav de l'admin personnalisée : réordonne les entrées du menu selon le global
 * « nav-settings », puis délègue tout le rendu au Nav natif de Payload
 * (aucune régression : liens, état actif, i18n, repli sont ceux de Payload).
 *
 * Ordre des groupes = première apparition d'une de leurs entrées. Les entrées
 * non listées gardent leur ordre par défaut (tri stable), à la fin.
 */
type Entity = { slug?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomNav = async (props: any) => {
  const payload = props?.payload
  if (!payload?.config) return <DefaultNav {...props} />

  let order: string[] = []
  try {
    const nav = await payload.findGlobal({ slug: 'nav-settings', depth: 0, overrideAccess: true })
    order = ((nav?.order as { entity?: string }[] | undefined) || [])
      .map((o) => o?.entity)
      .filter((s): s is string => Boolean(s))
  } catch {
    order = []
  }

  if (order.length === 0) return <DefaultNav {...props} />

  const rank = (slug?: string) => {
    const i = slug ? order.indexOf(slug) : -1
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  const byRank = (a: Entity, b: Entity) => rank(a.slug) - rank(b.slug)

  const collections = [...(payload.config.collections || [])].sort(byRank)
  const globals = [...(payload.config.globals || [])].sort(byRank)

  // Object.create : on hérite de l'instance payload (méthodes, importMap…) et on
  // ne remplace que la config (ordre des collections/globals) pour ce rendu.
  const reordered = Object.create(payload)
  reordered.config = { ...payload.config, collections, globals }

  return <DefaultNav {...props} payload={reordered} />
}
