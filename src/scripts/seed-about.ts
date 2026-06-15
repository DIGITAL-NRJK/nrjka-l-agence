/* eslint-disable @typescript-eslint/no-explicit-any */
import { toLexical } from './_md-to-lexical'

const story = `## Notre raison d'être

NRJKA est née d'un constat simple : trop d'entreprises subissent leur digital au lieu de le maîtriser — prisonnières d'un outil, d'un abonnement ou d'un jargon qui les dépasse. On a voulu une autre voie : un digital clair, souverain et durable, pensé pour les TPE, PME, artisans et associations.

## Notre méthode : l'architecture D4™

Diagnostic, Design, Développement, Durabilité. Quatre temps pour passer de la complexité à la clarté, et construire des solutions qui durent — que vous gardez en main.

## Ce qui nous distingue

On choisit nos projets avec soin, et on s'engage à fond : sur le travail comme sur la relation. On privilégie l'open source et l'auto-hébergement pour que vos données et vos outils restent chez vous. Et derrière chaque échange, il y a un humain — pas un ticket.

## Notre ambition

Rendre la technologie accessible et compréhensible, pour que vous gagniez en visibilité, en temps et en autonomie — sans jamais dépendre d'un prestataire de plus.`

export async function seedAbout(payload: any) {
  const data: any = {
    title: 'À propos',
    slug: 'a-propos',
    _status: 'published',
    hero: { type: 'none' },
    layout: [
      {
        blockType: 'content',
        columns: [{ size: 'full', enableLink: false, richText: toLexical(story) }],
      },
      {
        blockType: 'ctaFinal',
        eyebrow: 'À propos',
        title: 'Travaillons ensemble — vraiment.',
        body: "On choisit nos projets avec soin. En échange, on s'engage à fond, sur le travail comme sur la relation.",
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
