/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Crée (ou met à jour) la page « Réalisations » publiée, avec le bloc Liste des réalisations,
 * et ajoute le lien « Réalisations » dans le Header et le Footer.
 * Lancement : pnpm payload run src/scripts/seed-realisations.ts
 * Tout reste éditable ensuite dans l'admin.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })

  const data: any = {
    title: 'Réalisations',
    slug: 'realisations',
    _status: 'published',
    hero: { type: 'none' },
    layout: [
      {
        blockType: 'caseStudiesIndex',
        eyebrow: 'Réalisations',
        title: 'Des projets qui parlent d’eux-mêmes',
        intro:
          'Chaque projet est une histoire de clarté retrouvée. Filtrez par secteur ou par type pour explorer notre travail.',
      },
    ],
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'realisations' } },
    limit: 1,
    pagination: false,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    payload.logger.info('↻ Page mise à jour : realisations')
  } else {
    await payload.create({ collection: 'pages', data })
    payload.logger.info('✅ Page créée : realisations')
  }

  // Ajoute « Réalisations » au menu (Header avant Contact, Footer en fin)
  const item = {
    link: { type: 'custom', url: '/realisations', label: 'Réalisations', newTab: false },
  }

  for (const slug of ['header', 'footer'] as const) {
    const g: any = await payload.findGlobal({ slug })
    const items: any[] = g?.navItems || []
    if (items.some((i) => i?.link?.url === '/realisations')) continue

    if (slug === 'header') {
      const idx = items.findIndex((i) => i?.link?.url === '/contact')
      if (idx >= 0) items.splice(idx, 0, item)
      else items.push(item)
    } else {
      items.push(item)
    }
    await payload.updateGlobal({ slug, data: { navItems: items } })
    payload.logger.info(`✅ Lien Réalisations ajouté au ${slug}.`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
