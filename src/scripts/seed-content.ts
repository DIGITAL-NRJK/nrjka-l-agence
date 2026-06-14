/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Injecte dans le site :
 *  - le redesign Engagements (principes + mots-clés) sur la home,
 *  - une mini-FAQ conversion (5 Q) sur la home,
 *  - une mini-FAQ pratique (4 Q) sur la page contact.
 * Lancement : pnpm payload run src/scripts/seed-content.ts
 * Idempotent : ne duplique pas les blocs FAQ s'ils existent déjà.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const engagements = {
  eyebrow: 'Nos engagements',
  title: 'Notre façon de travailler',
  intro:
    'Pas des promesses marketing : des principes qui guident chaque projet — et que vous pouvez nous opposer.',
  commitments: [
    {
      keyword: 'RÉSULTAT',
      title: 'Le résultat avant l’esthétique.',
      description:
        'Chaque choix sert votre croissance — visibilité, temps gagné, autonomie — pas notre portfolio.',
    },
    {
      keyword: 'ENGAGEMENT',
      title: 'Engagés à fond, sur peu de projets.',
      description:
        'On choisit nos clients avec soin pour donner à chacun le maximum. Quand on s’engage, on est responsables du résultat.',
    },
    {
      keyword: 'HUMAIN',
      title: 'Un humain, pas un ticket.',
      description:
        'Derrière chaque marque, une personne avec de vrais enjeux. On ne l’oublie jamais.',
    },
    {
      keyword: 'PROPRIÉTÉ',
      title: 'Vous restez propriétaire.',
      description:
        'Open source par défaut, vos données chez vous, vos fichiers sources livrés. Jamais dépendant d’un prestataire de plus.',
    },
    {
      keyword: 'TRANSPARENCE',
      title: 'Des prix clairs, sans piège.',
      description:
        'Devis sur-mesure après audit gratuit, sans coût caché ni abonnement qui enferme.',
    },
    {
      keyword: 'SOBRIÉTÉ',
      title: 'Un numérique sobre et durable.',
      description:
        'Des solutions légères et éco-conçues, qui durent — parce que la sobriété est aussi une performance.',
    },
  ],
}

const homeFaq = {
  blockType: 'faq',
  eyebrow: 'Questions fréquentes',
  title: 'Vous hésitez encore ?',
  intro: 'Les réponses aux questions qu’on nous pose le plus souvent.',
  items: [
    {
      question: 'Combien coûte un projet avec NRJKA ?',
      answer:
        'Cela dépend de votre besoin. On raisonne en valeur, avec un devis clair établi après un audit gratuit — sans coût caché. L’objectif : que votre projet vous rapporte, en visibilité, en temps ou en clients.',
    },
    {
      question: 'Par où commence-t-on ?',
      answer:
        'Par un audit gratuit et sans engagement. On comprend votre situation, on identifie les priorités, et on vous propose un plan concret. Vous décidez ensuite.',
    },
    {
      question: 'Travaillez-vous avec les petites structures ?',
      answer:
        'Oui — TPE, PME, artisans, associations. Notre approche est premium mais accessible : on adapte le périmètre à votre réalité, sans jargon.',
    },
    {
      question: 'Vais-je être autonome, ou dépendant de vous ?',
      answer:
        'Autonome. Open source, formation incluse, fichiers et données qui vous appartiennent. On vous rend les clés ; on reste disponible si vous le souhaitez, jamais comme un passage obligé.',
    },
    {
      question: 'Combien de temps avant d’avoir des résultats ?',
      answer:
        'Un site soigné se compte en semaines ; la visibilité (SEO) en quelques mois. On fixe des jalons clairs dès le départ, sans mauvaise surprise.',
    },
  ],
}

const contactFaq = {
  blockType: 'faq',
  eyebrow: 'Avant de nous écrire',
  title: 'Quelques précisions utiles',
  items: [
    {
      question: 'Que se passe-t-il après mon message ?',
      answer:
        'On revient vers vous sous 48 h ouvrées, avec une vraie personne — pas un accusé de réception automatique. On cale un échange pour comprendre votre besoin.',
    },
    {
      question: 'L’audit est-il vraiment gratuit ?',
      answer:
        'Oui, et sans engagement. C’est notre façon de démarrer une relation : vous repartez avec des pistes concrètes, que vous travailliez avec nous ou non.',
    },
    {
      question: 'Je n’ai pas encore de projet précis, je peux quand même vous contacter ?',
      answer:
        'Bien sûr. Une simple idée à creuser suffit. Souvent, l’échange aide justement à clarifier le besoin.',
    },
    {
      question: 'Comment se passe la suite si on travaille ensemble ?',
      answer:
        'Proposition sur-mesure, puis on avance par jalons clairs, avec un espace partagé pour suivre l’avancement. Vous gardez la visibilité à chaque étape.',
    },
  ],
}

const findPage = async (payload: any, slug: string) => {
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    pagination: false,
  })
  return res.docs[0] || null
}

const run = async () => {
  const payload = await getPayload({ config })

  // --- HOME : Engagements + FAQ ---
  const home = await findPage(payload, 'home')
  if (home && Array.isArray(home.layout)) {
    const layout: any[] = home.layout

    // 1) Redesign Engagements
    const cm = layout.find((b) => b?.blockType === 'commitments')
    if (cm) {
      cm.eyebrow = engagements.eyebrow
      cm.title = engagements.title
      cm.intro = engagements.intro
      cm.commitments = engagements.commitments
      payload.logger.info('✅ Engagements mis à jour (principes + mots-clés).')
    } else {
      payload.logger.info('ℹ️ Bloc Engagements introuvable sur la home.')
    }

    // 2) FAQ conversion (avant le CTA final)
    if (!layout.some((b) => b?.blockType === 'faq')) {
      const idx = layout.findIndex((b) => b?.blockType === 'ctaFinal')
      if (idx >= 0) layout.splice(idx, 0, { ...homeFaq })
      else layout.push({ ...homeFaq })
      payload.logger.info('✅ FAQ conversion ajoutée à la home.')
    } else {
      payload.logger.info('ℹ️ Une FAQ existe déjà sur la home (non dupliquée).')
    }

    await payload.update({
      collection: 'pages',
      id: home.id,
      data: { layout, _status: 'published' },
    })
  } else {
    payload.logger.warn('⚠️ Page home introuvable.')
  }

  // --- CONTACT : FAQ pratique ---
  const contact = await findPage(payload, 'contact')
  if (contact && Array.isArray(contact.layout)) {
    const layout: any[] = contact.layout
    if (!layout.some((b) => b?.blockType === 'faq')) {
      layout.push({ ...contactFaq })
      await payload.update({
        collection: 'pages',
        id: contact.id,
        data: { layout, _status: 'published' },
      })
      payload.logger.info('✅ FAQ pratique ajoutée à la page contact.')
    } else {
      payload.logger.info('ℹ️ Une FAQ existe déjà sur la page contact (non dupliquée).')
    }
  } else {
    payload.logger.warn('⚠️ Page contact introuvable (créez-la d’abord).')
  }

  payload.logger.info('🎉 Contenu injecté.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
