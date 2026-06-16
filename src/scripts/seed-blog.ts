/* eslint-disable @typescript-eslint/no-explicit-any */
// Crée les catégories de blog (pôles de 1er niveau + sous-catégories avec parent)
// et assigne la bonne catégorie aux articles. Appelé depuis une route (dev).

type CatSeed = { title: string; slug: string; parentSlug?: string }

const categories: CatSeed[] = [
  // Pôles — 1er niveau (sans parent)
  { title: 'Marque & Contenu', slug: 'marque-contenu' },
  { title: 'Web & Expérience', slug: 'web-experience' },
  { title: 'Performance & Visibilité', slug: 'performance-visibilite' },
  { title: 'Digitalisation & Process', slug: 'digitalisation-process' },
  // Sous-catégories — 2e niveau (exemple ; parent = un pôle)
  { title: 'Maintenance & Support', slug: 'maintenance-support', parentSlug: 'digitalisation-process' },
]

// Slug d'article → slug de catégorie assignée (ici la sous-catégorie Maintenance,
// qui porte son pôle parent « Digitalisation & Process »).
const articleCategory: Record<string, string> = {
  'site-non-maintenu-piratage': 'maintenance-support',
  'cout-panne-site-web': 'maintenance-support',
  'maintenance-preventive-vs-curative': 'maintenance-support',
}

export async function seedBlog(payload: any) {
  const catIdBySlug: Record<string, number | string> = {}

  const upsertCat = async (c: CatSeed) => {
    const data: any = { title: c.title, slug: c.slug }
    if (c.parentSlug && catIdBySlug[c.parentSlug]) data.parent = catIdBySlug[c.parentSlug]
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
      pagination: false,
    })
    if (existing.docs[0]) {
      const d = await payload.update({ collection: 'categories', id: existing.docs[0].id, data })
      catIdBySlug[c.slug] = d.id
    } else {
      const d = await payload.create({ collection: 'categories', data })
      catIdBySlug[c.slug] = d.id
    }
  }

  // 1) Parents d'abord, 2) enfants ensuite (pour résoudre les parentSlug)
  for (const c of categories.filter((c) => !c.parentSlug)) await upsertCat(c)
  for (const c of categories.filter((c) => c.parentSlug)) await upsertCat(c)

  // Backfill : recalcule l'intitulé-chemin (pathTitle) de TOUTES les catégories,
  // y compris celles créées à la main (déclenche le hook beforeChange).
  const all = await payload.find({ collection: 'categories', limit: 500, depth: 0, pagination: false })
  for (const c of all.docs as any[]) {
    await payload.update({
      collection: 'categories',
      id: c.id,
      data: { title: c.title, parent: c.parent ?? null },
    })
  }

  let assigned = 0
  for (const [postSlug, catSlug] of Object.entries(articleCategory)) {
    const post = await payload.find({
      collection: 'posts',
      where: { slug: { equals: postSlug } },
      limit: 1,
      pagination: false,
    })
    if (post.docs[0] && catIdBySlug[catSlug]) {
      await payload.update({
        collection: 'posts',
        id: post.docs[0].id,
        data: { categories: [catIdBySlug[catSlug]] },
      })
      assigned += 1
    }
  }

  return { categories: categories.length, articlesAssigned: assigned }
}
