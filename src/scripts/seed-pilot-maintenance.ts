/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pilote « Maintenance & Support » : enrichit le service (contenu sourcé) et crée
 * 3 articles de blog reliés (« Pour approfondir »).
 * Lancement : pnpm payload run src/scripts/seed-pilot-maintenance.ts
 * Sources citées : rapport Sucuri 2023 (sites piratés / CMS obsolètes), Datto 2023 (coût d'une panne).
 */
import { toLexical } from './_md-to-lexical'

const serviceLong = `## Pourquoi la maintenance n'est pas une option

Un site web vit dans un environnement qui bouge en permanence : navigateurs, extensions, failles de sécurité. Sans entretien, il se dégrade — et devient vulnérable.

Les chiffres parlent d'eux-mêmes : selon le rapport Sucuri 2023, **39 % des sites piratés tournaient sur un CMS obsolète** au moment de l'infection, et WordPress concentre près de **90 %** des sites compromis analysés. La cause n°1 reste les mises à jour non appliquées.

Et une panne coûte cher : pour une PME, le coût d'une heure d'indisponibilité se chiffre en **milliers d'euros** (ventes perdues, référencement abîmé, confiance entamée) — sans compter le temps de remise en route.

## Notre approche

On ne se contente pas d'« être là si ça casse ». On agit en amont : mises à jour testées, surveillance continue, sauvegardes automatiques et vérifiées, durcissement de la sécurité. L'objectif : que vous n'ayez jamais à y penser.

## Notre proposition de partenariat

Un plan de maintenance clair, sans engagement piégé. Vous savez ce qui est fait, quand et pourquoi. Vous gardez la propriété de votre site, de vos données et de votre hébergement — on vous accompagne, on ne vous rend pas captif. Et quand vous avez besoin d'aide, c'est une vraie personne qui répond, pas un ticket anonyme.`

const benefits = [
  'Sécurité renforcée',
  'Disponibilité maximale',
  'Pérennité de votre investissement',
  'Sérénité au quotidien',
]

const process_steps = [
  { title: 'Audit & sécurisation', description: 'État des lieux, mises à jour, durcissement de la configuration.' },
  { title: 'Surveillance continue', description: 'Monitoring de la disponibilité et des menaces, en continu.' },
  { title: 'Sauvegardes', description: 'Copies automatiques, testées et restaurables rapidement.' },
  { title: 'Support humain', description: 'Une vraie personne, réactive, qui connaît votre site.' },
]

const technologies = ['Uptime Kuma', 'CrowdSec', 'Sauvegardes chiffrées (restic / Borg)', 'Vaultwarden', 'Mises à jour gérées']

const faqs = [
  { question: 'À quelle fréquence intervenez-vous ?', answer: 'Les mises à jour critiques sont appliquées en continu ; un point de contrôle complet est réalisé chaque mois, avec un compte-rendu clair.' },
  { question: 'Que se passe-t-il en cas de piratage malgré tout ?', answer: 'On restaure rapidement une sauvegarde saine, on identifie la faille et on la corrige. La maintenance préventive rend ce cas rare — mais on est prêts.' },
  { question: 'Suis-je engagé sur la durée ?', answer: 'Non. Les plans sont sans engagement piégé : vous restez libre, et propriétaire de tout (site, données, hébergement).' },
  { question: 'Hébergez-vous aussi mon site ?', answer: 'Oui si vous le souhaitez (infogérance), sur une infrastructure souveraine — ou on maintient votre hébergement actuel.' },
]

const articles = [
  {
    slug: 'site-non-maintenu-piratage',
    title: 'Pourquoi un site non maintenu finit par se faire pirater (et comment l’éviter)',
    description:
      'Un CMS ou des extensions obsolètes sont la première porte d’entrée des piratages. Voici ce que disent les chiffres, et comment s’en protéger simplement.',
    body: `Un site qu'on ne met pas à jour ne reste pas « stable » : il devient une cible. Les pirates n'attaquent pas au hasard — ils exploitent des failles connues dans des versions anciennes de CMS et d'extensions.

## Ce que disent les chiffres

Selon le [rapport Sucuri 2023](https://sucuri.net/reports/2023-hacked-website-report/), **39 % des sites piratés tournaient sur un CMS obsolète** au moment de l'infection. WordPress, de loin le CMS le plus utilisé, concentre près de **90 %** des sites compromis analysés — non pas parce qu'il serait moins sûr, mais parce que son écosystème d'extensions, mal entretenu, multiplie les portes d'entrée.

## Le vrai risque n'est pas que technique

Un site piraté, ce n'est pas qu'un problème informatique. C'est votre référencement qui plonge (Google déclasse les sites compromis), vos visiteurs qui voient un avertissement rouge, et votre réputation qui en pâtit. La remise en état coûte presque toujours plus cher que la prévention.

## Comment s'en protéger

Trois réflexes suffisent à éliminer l'essentiel du risque : appliquer les mises à jour rapidement (et les tester avant), surveiller en continu la disponibilité et les menaces, et garder des sauvegardes récentes et restaurables. C'est exactement ce que couvre un plan de maintenance.

Vous voulez savoir où en est votre site ? [Demandez un audit gratuit](/contact) — on vous dit clairement ce qui est à jour, ce qui ne l'est pas, et ce qui mérite votre attention.`,
  },
  {
    slug: 'cout-panne-site-web',
    title: 'Combien coûte vraiment une panne de site web ?',
    description:
      'Au-delà des ventes perdues, une panne entame le référencement et la confiance. Estimation des coûts réels et des moyens de les éviter.',
    body: `Quand un site tombe, le premier coût est évident : les ventes ou les contacts qu'on ne capte pas pendant la panne. Mais c'est loin d'être le seul.

## Des montants qui surprennent

Pour une PME, le coût d'une heure d'indisponibilité est estimé à environ **8 000 $** en moyenne selon une étude Datto de 2023, reprise par de nombreux acteurs du secteur (voir par exemple [UptimeRobot](https://uptimerobot.com/blog/hidden-costs-of-downtime/)). Tout dépend bien sûr de votre activité, mais l'ordre de grandeur est parlant : même quelques heures d'arrêt pèsent lourd.

## Les coûts cachés

À la perte de chiffre d'affaires s'ajoutent des effets moins visibles : un référencement qui se dégrade si Google rencontre un site indisponible, des clients qui ne reviennent pas après une mauvaise expérience, et le temps (donc l'argent) passé à tout remettre en route dans l'urgence.

## La prévention coûte bien moins cher

Une surveillance continue, des sauvegardes testées et des mises à jour régulières évitent l'immense majorité des pannes — pour une fraction du coût d'un seul incident. C'est tout l'intérêt d'un plan de maintenance.

Envie d'y voir clair sur la fiabilité de votre site ? [Parlons-en](/contact), le premier échange est gratuit.`,
  },
  {
    slug: 'maintenance-preventive-vs-curative',
    title: 'Maintenance préventive vs curative : l’impact sur votre budget',
    description:
      'Réparer après coup coûte presque toujours plus cher que prévenir. Comparatif clair pour décider en connaissance de cause.',
    body: `Il y a deux façons d'aborder la maintenance d'un site : attendre que ça casse pour réparer (curatif), ou entretenir en continu pour éviter la casse (préventif). La différence se voit surtout… sur la facture.

## Le curatif : l'urgence, au prix fort

Réparer un site piraté ou en panne, c'est intervenir dans l'urgence, souvent sans sauvegarde récente, avec un site indisponible pendant ce temps. On paie alors la réparation **et** la perte d'activité. Et rien ne garantit que la faille d'origine soit traitée.

## Le préventif : prévisible et léger

La maintenance préventive lisse le coût dans le temps et le rend prévisible : mises à jour régulières, surveillance, sauvegardes. Le risque d'incident chute fortement, et quand un problème survient, une sauvegarde saine permet de repartir en minutes plutôt qu'en jours.

## Le bon réflexe

Pour la plupart des TPE et PME, un plan de maintenance préventive coûte bien moins, sur l'année, qu'un seul incident sérieux — tout en apportant la tranquillité d'esprit. C'est un investissement, pas une dépense.

Vous hésitez sur le niveau d'accompagnement adapté à votre site ? [Demandez un audit gratuit](/contact) : on vous propose un plan clair, sans engagement piégé.`,
  },
]

export async function seedPilotMaintenance(payload: any) {
  // 1) Enrichir le service EN PREMIER (le contenu s'affiche même si un article échoue)
  const svc = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'maintenance-support' } },
    limit: 1,
    pagination: false,
  })
  if (!svc.docs[0]) {
    return { ok: false, error: 'service maintenance-support introuvable (lance seed-expertises)' }
  }
  const serviceId = svc.docs[0].id
  await payload.update({
    collection: 'services',
    id: serviceId,
    data: {
      long_description: toLexical(serviceLong),
      benefits: benefits.map((benefit) => ({ benefit })),
      process_steps,
      technologies: technologies.map((name) => ({ name })),
      faqs,
      seo: {
        metaTitle: 'Maintenance & Support de site web — NRJKA',
        metaDescription:
          'Un site sécurisé, disponible et durable. Maintenance préventive, surveillance, sauvegardes et support humain — sans vous rendre captif.',
      },
    } as any,
  })

  // 2) Créer / mettre à jour les 3 articles (chacun isolé)
  const articleIds: (number | string)[] = []
  const articleErrors: string[] = []
  for (const a of articles) {
    try {
      const data: any = {
        title: a.title,
        slug: a.slug,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        content: toLexical(a.body),
        meta: { title: a.title, description: a.description },
      }
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: a.slug } },
        limit: 1,
        pagination: false,
      })
      if (existing.docs[0]) {
        const doc = await payload.update({ collection: 'posts', id: existing.docs[0].id, data })
        articleIds.push(doc.id)
      } else {
        const doc = await payload.create({ collection: 'posts', data })
        articleIds.push(doc.id)
      }
    } catch (err) {
      articleErrors.push(`${a.slug}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 3) Relier les articles créés au service
  if (articleIds.length > 0) {
    await payload.update({
      collection: 'services',
      id: serviceId,
      data: { related_articles: articleIds } as any,
    })
  }

  return { ok: true, articles: articleIds.length, articleErrors }
}
