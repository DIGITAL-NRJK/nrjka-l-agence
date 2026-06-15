/* eslint-disable @typescript-eslint/no-explicit-any */
// Crée les catégories de blog alignées sur les pôles + assigne la bonne catégorie aux articles.
// Appelé depuis une route (le serveur dev se connecte bien à la base).

const categories = [
  { title: 'Marque & Contenu', slug: 'marque-contenu' },
  { title: 'Web & Expérience', slug: 'web-experience' },
  { title: 'Performance & Visibilité', slug: 'performance-visibilite' },
  { title: 'Digitalisation & Process', slug: 'digitalisation-process' },
]

// Slug d'article → slug de catégorie (les 3 articles pilotes parlent de maintenance → Process)
const articleCategory: Record<string, string> = {
  'site-non-maintenu-piratage': 'digitalisation-process',
  'cout-panne-site-web': 'digitalisation-process',
  'maintenance-preventive-vs-curative': 'digitalisation-process',
}

export async function seedBlog(payload: any) {
  const catIdBySlug: Record<string, number | string> = {}
  for (const c of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
      pagination: false,
    })
    if (existing.docs[0]) {
      const d = await payload.update({ collection: 'categories', id: existing.docs[0].id, data: c })
      catIdBySlug[c.slug] = d.id
    } else {
      const d = await payload.create({ collection: 'categories', data: c })
      catIdBySlug[c.slug] = d.id
    }
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
