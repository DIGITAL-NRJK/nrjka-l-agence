/* eslint-disable @typescript-eslint/no-explicit-any */
// Page « À propos » — design dédié (mockup validé juin 2026).
// Blocs sur-mesure éditables : aboutHero · ctaFinal (citation) · d4Cards ·
// distinctions · statsBand · ctaFinal (final). Aucun bloc interactif de la home
// n'est réutilisé → la page a sa propre voix (pas de redondance avec l'accueil).

export async function seedAbout(payload: any) {
  const data: any = {
    title: 'À propos',
    slug: 'a-propos',
    _status: 'published',
    hero: { type: 'none' },

    layout: [
      // 1 · Hero À propos — discours + chips + visuel
      {
        blockType: 'aboutHero',
        badge: 'À propos',
        title: 'On construit votre digital.',
        titleAccent: 'Vous en gardez les clés.',
        subtitle:
          "NRJKA est une agence digitale qui rend la technologie accessible aux TPE, PME, artisans et associations. Sites web, SEO, automatisation et CRM — pensés pour la clarté, l'autonomie et la durée.",
        chips: [
          { value: '100%', label: 'open source' },
          { value: 'D4™', label: 'méthode signature' },
          { value: 'FR · GH', label: 'deux marchés' },
        ],
      },

      // 2 · Citation navy — CtaFinal sans boutons
      {
        blockType: 'ctaFinal',
        eyebrow: "Notre raison d'être",
        title:
          'Trop d’entreprises subissent leur digital. Nous, on le rend clair, souverain et durable.',
        body: "NRJKA est née d'un constat simple : trop d'acteurs restent prisonniers d'un outil, d'un abonnement ou d'un jargon qui les dépasse. On a voulu une autre voie — un digital que vous comprenez et que vous gardez en main.",
      },

      // 3 · Méthode D4 — cartes statiques
      {
        blockType: 'd4Cards',
        eyebrow: 'La méthode',
        title: 'L’architecture D4™',
        cards: [
          { title: 'Diagnostic', tagline: "Comprendre avant d'agir" },
          { title: 'Design', tagline: 'Concevoir clair' },
          { title: 'Développement', tagline: 'Construire solide' },
          { title: 'Durabilité', tagline: 'Transmettre, autonomiser' },
        ],
      },

      // 4 · Ce qui nous distingue — cartes claires
      {
        blockType: 'distinctions',
        title: 'Ce qui nous distingue',
        items: [
          {
            icon: 'shield',
            title: 'Souveraineté',
            description: 'Open source, auto-hébergé. Vos données restent chez vous.',
          },
          {
            icon: 'messageCircle',
            title: 'Engagement humain',
            description: 'Un humain derrière chaque échange, pas un ticket.',
          },
          {
            icon: 'target',
            title: 'Sélectivité',
            description: "On choisit nos projets — et on s'engage à fond.",
          },
        ],
      },

      // 5 · L'équipe — grille de membres (placeholders à compléter dans l'admin)
      {
        blockType: 'team',
        eyebrow: 'L’équipe',
        title: 'Les visages derrière NRJKA',
        intro:
          'Une équipe à taille humaine — un interlocuteur qui connaît votre projet du début à la fin.',
        members: [
          { name: 'Prénom Nom', role: 'Fondateur · Direction' },
          { name: 'Prénom Nom', role: 'Développement' },
          { name: 'Prénom Nom', role: 'Design & UX' },
        ],
      },

      // 6 · Bande de chiffres — claire
      {
        blockType: 'statsBand',
        items: [
          { value: '+33%', label: 'de revenus avec une marque cohérente' },
          { value: '0', label: 'dépendance à un prestataire imposé' },
          { value: 'D4™', label: 'une méthode, du diagnostic au transfert' },
        ],
      },

      // 7 · CTA final — navy
      {
        blockType: 'ctaFinal',
        eyebrow: 'Travailler ensemble',
        title: 'Travaillons ensemble — vraiment.',
        body: "On choisit nos projets avec soin. En échange, on s'engage à fond — sur le travail comme sur la relation.",
        primaryCtaLabel: 'Demander un audit',
        primaryCtaHref: '/contact',
        secondaryCtaLabel: 'Voir nos réalisations',
        secondaryCtaHref: '/realisations',
      },
    ],
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'a-propos' } },
    limit: 1,
    pagination: false,
  })
  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    return { ok: true, action: 'updated' }
  }
  await payload.create({ collection: 'pages', data })
  return { ok: true, action: 'created' }
}
