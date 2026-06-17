/* eslint-disable @typescript-eslint/no-explicit-any */
// Seed d'exemples pour la page /ressources : ressources gratuites + produits.
// Idempotent (clé = slug). Données d'EXEMPLE publiées — à remplacer / dépublier.

const resources = [
  {
    title: 'Checklist SEO local',
    slug: 'checklist-seo-local',
    description: '15 points à vérifier pour être visible dans votre ville sur Google.',
    category: 'checklist',
    format: 'pdf',
    is_free: true,
    requires_contact: true,
    published: true,
    features: [
      { feature: '15 points concrets' },
      { feature: 'Spécial TPE & commerces' },
      { feature: 'Sans jargon' },
    ],
    tags: [{ tag: 'SEO' }, { tag: 'Local' }],
  },
  {
    title: 'Modèle de cahier des charges — site web',
    slug: 'modele-cahier-des-charges-site-web',
    description:
      'Un modèle prêt à remplir pour cadrer votre projet de site avant de consulter une agence.',
    category: 'template',
    format: 'docx',
    is_free: true,
    requires_contact: true,
    published: true,
    features: [
      { feature: 'Structure complète' },
      { feature: 'Exemples de rubriques' },
      { feature: 'Format éditable' },
    ],
    tags: [{ tag: 'Web' }, { tag: 'Cadrage' }],
  },
  {
    title: 'Guide : choisir un CRM open source',
    slug: 'guide-crm-open-source',
    description:
      'Comparatif clair des solutions libres (Dolibarr & co) pour gérer vos clients sans dépendance.',
    category: 'guide',
    format: 'pdf',
    is_free: true,
    requires_contact: true,
    published: true,
    features: [
      { feature: 'Comparatif honnête' },
      { feature: 'Critères de choix' },
      { feature: 'Souveraineté des données' },
    ],
    tags: [{ tag: 'CRM' }, { tag: 'Open source' }],
  },
]

const products = [
  {
    title: 'Audit SEO express',
    slug: 'audit-seo-express',
    description:
      'Un diagnostic de votre visibilité avec un plan d’action priorisé, livré sous 5 jours.',
    price: 99,
    category: 'tools',
    bestseller: true,
    published: true,
    features: [
      { feature: 'Analyse technique + contenu' },
      { feature: 'Plan d’action priorisé' },
      { feature: 'Restitution claire' },
    ],
  },
  {
    title: 'Pack démarrage — présence web',
    slug: 'pack-demarrage-presence-web',
    description: 'Site vitrine essentiel, configuré et prêt à publier, que vous gardez en main.',
    price: 490,
    category: 'packs',
    published: true,
    features: [
      { feature: 'Site vitrine clé en main' },
      { feature: 'Open source, hébergement souverain' },
      { feature: 'Prise en main incluse' },
    ],
  },
  {
    title: 'Formation — autonomie WordPress',
    slug: 'formation-autonomie-wordpress',
    description:
      'Apprenez à gérer votre site vous-même : pages, articles, médias, sauvegardes.',
    price: 149,
    category: 'formations',
    published: true,
    features: [
      { feature: 'Session en visio' },
      { feature: 'Support pas-à-pas' },
      { feature: 'Replay fourni' },
    ],
  },
  {
    title: 'Modèles de pages — Notion',
    slug: 'modeles-pages-notion',
    description: 'Des modèles prêts à l’emploi pour organiser votre activité au quotidien.',
    price: 29,
    category: 'templates',
    published: true,
    features: [{ feature: '6 modèles' }, { feature: 'Duplicables en 1 clic' }],
  },
]

async function upsert(payload: any, collection: string, slug: string, data: any) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
  })
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data })
    return 'updated'
  }
  await payload.create({ collection, data })
  return 'created'
}

// Page éditable « Ressources » : hero none + bloc catalogue (header éditable).
async function upsertResourcesPage(payload: any) {
  const data: any = {
    title: 'Ressources',
    slug: 'ressources',
    _status: 'published',
    hero: { type: 'none' },
    layout: [
      {
        blockType: 'resourcesCatalog',
        eyebrow: 'Ressources',
        title: 'Ressources & outils',
        subtitle:
          'Des ressources gratuites et des produits pour gagner en autonomie sur votre digital — sans dépendance, sans jargon. Le paiement en ligne arrive bientôt.',
      },
    ],
  }
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'ressources' } },
    limit: 1,
    pagination: false,
  })
  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    return 'updated'
  }
  await payload.create({ collection: 'pages', data })
  return 'created'
}

export async function seedResources(payload: any) {
  const out: Record<string, string> = {}
  for (const r of resources) out[`resource:${r.slug}`] = await upsert(payload, 'resources', r.slug, r)
  for (const p of products) out[`product:${p.slug}`] = await upsert(payload, 'products', p.slug, p)
  out['page:ressources'] = await upsertResourcesPage(payload)
  return { ok: true, ...out }
}
