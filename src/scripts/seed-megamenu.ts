/* eslint-disable @typescript-eslint/no-explicit-any */
// Pré-remplit le méga-menu (global Header → megamenu.poles) en RELATIONS vers les
// collections Pôles & Expertises + Services. NE FAIT RIEN si des pôles valides sont
// déjà saisis (pour ne pas écraser les réglages manuels). Re-remplit si l'ancienne
// version (texte libre) est détectée.

export async function seedMegamenu(payload: any) {
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  const existing = header?.megamenu?.poles
  const looksValid =
    Array.isArray(existing) && existing.length > 0 && existing.every((p: any) => p?.pole)
  if (looksValid) {
    return { ok: true, skipped: 'poles déjà définis' }
  }

  const [polesRes, servicesRes] = await Promise.all([
    payload.find({
      collection: 'expertises',
      where: { published: { equals: true } },
      sort: 'order',
      limit: 50,
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

  // ids de services regroupés par pôle
  const serviceIdsByPole: Record<string, (number | string)[]> = {}
  for (const s of servicesRes.docs as any[]) {
    const pid = s.pole && typeof s.pole === 'object' ? String(s.pole.id) : String(s.pole)
    ;(serviceIdsByPole[pid] ||= []).push(s.id)
  }

  const poles = (polesRes.docs as any[]).map((p) => ({
    pole: p.id,
    services: (serviceIdsByPole[String(p.id)] || []).map((id) => ({ service: id })),
  }))

  await payload.updateGlobal({
    slug: 'header',
    data: { megamenu: { ...(header?.megamenu || {}), poles } },
  })

  return { ok: true, poles: poles.length }
}
