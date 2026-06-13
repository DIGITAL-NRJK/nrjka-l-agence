/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Crée (ou met à jour) les 4 pages d'expertise (piliers) dans la collection Services,
 * publiées, avec contenu premium + FAQ, puis branche les liens des piliers de la home.
 * Lancement : pnpm payload run src/scripts/seed-expertises.ts
 * Tout reste éditable ensuite dans l'admin.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

type Expertise = {
  slug: string
  title: string
  icon: string
  category: string
  description: string
  long: string
  benefits: string[]
  features: string[]
  process: { title: string; description: string }[]
  technologies: string[]
  faqs: { question: string; answer: string }[]
}

const expertises: Expertise[] = [
  {
    slug: 'marque-contenu',
    title: 'Marque & Contenu',
    icon: 'Palette',
    category: 'web-mobile',
    description:
      'Une marque claire, cohérente et mémorable — du positionnement à la charte graphique, du message aux contenus.',
    long: `Avant la technique, il y a le sens. Nous posons d'abord les fondations de votre marque : ce que vous êtes, ce que vous promettez, et à qui.

De ce socle découlent une identité visuelle juste, un ton de voix reconnaissable et des contenus qui portent vraiment votre valeur. Pas de gadgets : une cohérence totale, sur chaque support, qui installe la confiance et facilite tout le reste de votre présence digitale.`,
    benefits: ['Reconnaissance immédiate', 'Positionnement clair', 'Connexion émotionnelle', 'Cohérence totale'],
    features: [
      'Naming & tagline',
      'Logo & déclinaisons',
      'Charte graphique & brand book',
      'Positionnement & tone of voice',
      'Copywriting web',
      'Direction artistique',
      'Plan de communication',
      'Calendrier éditorial',
    ],
    process: [
      { title: 'Immersion', description: 'On comprend votre ADN, vos valeurs et vos cibles.' },
      { title: 'Stratégie', description: 'On définit le positionnement et les axes créatifs.' },
      { title: 'Création', description: "On conçoit l'identité visuelle et les messages." },
      { title: 'Déploiement', description: 'On décline la marque sur tous vos supports.' },
    ],
    technologies: ['Figma', 'Penpot (open source)', 'Suite libre (GIMP, Inkscape)'],
    faqs: [
      {
        question: 'Je démarre de zéro, vous pouvez créer ma marque complète ?',
        answer:
          "Oui. Du nom à la charte graphique en passant par le ton et les premiers contenus, on construit une marque cohérente et prête à l'emploi. Vous repartez avec un brand book clair et tous les fichiers sources — ils vous appartiennent.",
      },
      {
        question: "J'ai déjà un logo, puis-je ne prendre qu'une partie ?",
        answer:
          'Bien sûr. On peut intervenir sur un périmètre précis (refonte de charte, copywriting, direction artistique) et s’appuyer sur l’existant. On commence toujours par un audit gratuit pour cibler ce qui aura le plus d’impact.',
      },
      {
        question: 'Les fichiers sources sont-ils livrés ?',
        answer:
          'Toujours. Vous récupérez l’ensemble des fichiers sources et des droits associés. Notre principe : vous restez propriétaire de votre marque, sans dépendance à un prestataire.',
      },
    ],
  },
  {
    slug: 'web-experience',
    title: 'Web & Expérience',
    icon: 'Globe',
    category: 'web-mobile',
    description:
      'Des sites et e-commerce sur-mesure, rapides et évolutifs — pensés pour convertir, et pour vous appartenir.',
    long: `Un site n'est pas qu'une vitrine : c'est votre meilleur commercial, disponible en continu. Nous concevons des plateformes performantes, accessibles et faciles à faire vivre.

Nous privilégions des technologies ouvertes et souveraines — WordPress, WooCommerce, PrestaShop, Medusa ou du headless sur-mesure — pour que vous ne soyez jamais prisonnier d'un outil. Vous gardez la main sur votre contenu, vos données et votre hébergement.`,
    benefits: ['100% responsive', 'Core Web Vitals A+', 'SEO-ready', 'Sécurisé & souverain'],
    features: [
      'Sites vitrines sur-mesure',
      'E-commerce (WooCommerce, PrestaShop, Medusa)',
      'Sites institutionnels',
      'Headless & développement custom',
      'Design responsive',
      'Optimisation SEO & performance',
      'Back-office intuitif',
      'Formation incluse',
    ],
    process: [
      { title: 'Discovery', description: 'On analyse vos besoins et vos objectifs business.' },
      { title: 'Design', description: 'On valide ensemble maquettes et prototypes.' },
      { title: 'Développement', description: 'On intègre et développe sur-mesure.' },
      { title: 'Lancement', description: 'Tests, formation et mise en production.' },
    ],
    technologies: ['WordPress', 'WooCommerce', 'PrestaShop', 'Medusa', 'Next.js', 'Payload CMS'],
    faqs: [
      {
        question: 'Pourquoi pas Shopify ?',
        answer:
          'Shopify est pratique mais c’est une location : vos données et votre boutique vivent chez un tiers, avec des frais et des limites. Nous préférons des solutions open source comme WooCommerce, PrestaShop ou Medusa, que vous hébergez et possédez réellement. À la clé : plus de liberté et des coûts maîtrisés sur la durée.',
      },
      {
        question: 'Serai-je autonome pour modifier mon site ?',
        answer:
          'Oui, c’est un objectif central. On choisit un back-office clair, et la formation est incluse. Vous éditez vos pages, vos produits et vos contenus sans dépendre de nous au quotidien.',
      },
      {
        question: 'Combien de temps pour un site ?',
        answer:
          'Un site vitrine soigné se compte en semaines, un e-commerce ou un projet headless davantage selon le périmètre. On vous donne un calendrier clair dès l’audit, sans surprise.',
      },
    ],
  },
  {
    slug: 'performance-visibilite',
    title: 'Performance & Visibilité',
    icon: 'TrendingUp',
    category: 'seo',
    description:
      'Référencement naturel, optimisation pour les moteurs IA (AIO) et campagnes ROIstes — une visibilité durable et mesurable.',
    long: `La visibilité ne s'improvise pas et ne s'achète pas durablement. Nous combinons un SEO technique solide, des contenus utiles et une optimisation pour les nouveaux moteurs IA (ChatGPT, Perplexity, Claude).

Tout est mesuré, en clair. Nous privilégions des outils de mesure respectueux de la vie privée comme Matomo, pour que vos données d'audience restent les vôtres — et que vos décisions s'appuient sur des chiffres fiables, pas sur des impressions.`,
    benefits: ['Visibilité accrue', 'Trafic qualifié', 'ROI mesurable', 'IA-ready'],
    features: [
      'Audit SEO technique',
      'Stratégie de contenu',
      'Optimisation AIO (moteurs IA)',
      'Google Ads',
      'Social Ads',
      'Social media',
      'Analytics & tableaux de bord',
      'Reporting mensuel clair',
    ],
    process: [
      { title: 'Audit', description: 'État des lieux technique, contenu et concurrence.' },
      { title: 'Stratégie', description: 'Priorités, mots-clés et plan de contenu.' },
      { title: 'Exécution', description: 'Optimisations on-page, contenus, campagnes.' },
      { title: 'Mesure', description: 'Suivi des positions, du trafic et du ROI.' },
    ],
    technologies: ['Matomo (open source)', 'Google Search Console', 'Metabase', 'Data structurée Schema.org'],
    faqs: [
      {
        question: "C'est quoi l'AIO, et pourquoi ça compte ?",
        answer:
          'L’AIO (AI Optimization) consiste à rendre votre site lisible et citable par les moteurs IA comme ChatGPT, Perplexity ou Claude — qui répondent de plus en plus aux recherches. Structure sémantique, données structurées, contenu clair : on optimise pour être compris et recommandé par ces nouveaux acteurs.',
      },
      {
        question: 'En combien de temps voit-on des résultats SEO ?',
        answer:
          'Le SEO est un investissement de fond : les premiers effets se voient souvent en 2 à 4 mois, et s’installent durablement. On commence par les gains rapides (technique, pages clés) pendant que la stratégie de contenu monte en puissance.',
      },
      {
        question: 'Pourquoi Matomo plutôt que Google Analytics ?',
        answer:
          'Matomo est open source et respecte la vie privée : vos données d’audience vous appartiennent et restent hébergées chez vous, sans partage publicitaire. C’est cohérent avec notre approche souveraine — et souvent plus simple côté conformité RGPD.',
      },
    ],
  },
  {
    slug: 'digitalisation-process',
    title: 'Digitalisation & Process',
    icon: 'Database',
    category: 'automation',
    description:
      'ERP, CRM et automatisations pour éliminer la double saisie et gagner du temps — avec des outils open source que vous maîtrisez.',
    long: `La vraie productivité, c'est arrêter de perdre du temps sur des tâches répétitives. Nous connectons vos outils et automatisons vos flux pour supprimer les doubles saisies et les oublis.

Notre parti pris : des briques open source et auto-hébergeables — Dolibarr pour l'ERP/CRM, n8n pour l'automatisation — pour que vos process et vos données restent chez vous. On vous forme à les piloter, pour une autonomie réelle, sans dépendance.`,
    benefits: ['Gain de temps', 'Zéro double saisie', 'Process documentés', 'Équipe autonome'],
    features: [
      'ERP Dolibarr',
      'CRM (Dolibarr / Notion)',
      'Automatisation n8n',
      'Synchronisation site ↔ ERP',
      'Tableaux de bord Metabase',
      'Audit & cartographie des process',
      'Formation des équipes',
      'Maintenance incluse',
    ],
    process: [
      { title: 'Audit', description: 'On cartographie vos process et vos irritants.' },
      { title: 'Conception', description: 'On dessine les flux et les automatisations.' },
      { title: 'Intégration', description: 'On connecte vos outils et on automatise.' },
      { title: 'Autonomie', description: 'On forme vos équipes et on documente tout.' },
    ],
    technologies: ['Dolibarr', 'n8n', 'Metabase', 'Notion', 'Vaultwarden'],
    faqs: [
      {
        question: 'Pourquoi des outils open source plutôt que Make ou Zapier ?',
        answer:
          'Make et Zapier sont efficaces mais facturés à l’usage et hébergés chez des tiers : vos automatisations et vos données en dépendent. Avec n8n auto-hébergé, vous gardez le contrôle complet, sans coût à la tâche — et vos flux restent souverains.',
      },
      {
        question: 'Dolibarr, c’est adapté à une petite structure ?',
        answer:
          'Oui. Dolibarr est modulaire : on n’active que ce dont vous avez besoin (devis, factures, stocks, CRM). C’est open source, économique et évolutif — idéal pour les TPE/PME et les associations qui veulent se structurer sans s’enfermer.',
      },
      {
        question: 'Vais-je dépendre de vous pour faire tourner tout ça ?',
        answer:
          'Non, c’est tout l’inverse de notre promesse. On documente vos process et on forme vos équipes pour que vous soyez autonomes. On reste disponible pour les évolutions, mais jamais comme un point de blocage.',
      },
    ],
  },
]

// Map titre de pilier (home) -> slug d'expertise, pour brancher les liens
const pillarLinkByTitle: Record<string, string> = {
  'Marque & Contenu': '/expertises/marque-contenu',
  'Web & Expérience': '/expertises/web-experience',
  'Performance & Visibilité': '/expertises/performance-visibilite',
  'Digitalisation & Process': '/expertises/digitalisation-process',
}

const run = async () => {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const toLex = (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })

  // 1) Upsert des 4 services
  for (let i = 0; i < expertises.length; i++) {
    const e = expertises[i]
    const data: any = {
      title: e.title,
      slug: e.slug,
      description: e.description,
      long_description: toLex(e.long),
      category: e.category,
      icon: e.icon,
      published: true,
      order: i + 1,
      benefits: e.benefits.map((benefit) => ({ benefit })),
      features: e.features.map((feature) => ({ feature })),
      process_steps: e.process,
      technologies: e.technologies.map((name) => ({ name })),
      faqs: e.faqs,
      seo: {
        metaTitle: `${e.title} — Expertise NRJKA`,
        metaDescription: e.description,
      },
    }

    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: e.slug } },
      limit: 1,
      pagination: false,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'services', id: existing.docs[0].id, data })
      payload.logger.info(`↻ Service mis à jour : ${e.slug}`)
    } else {
      await payload.create({ collection: 'services', data })
      payload.logger.info(`✅ Service créé : ${e.slug}`)
    }
  }

  // 2) Brancher les liens des piliers de la home
  try {
    const home = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    const page: any = home.docs[0]
    if (page && Array.isArray(page.layout)) {
      let touched = false
      for (const block of page.layout) {
        if (block?.blockType === 'pillars' && Array.isArray(block.pillars)) {
          for (const p of block.pillars) {
            const target = pillarLinkByTitle[(p.title || '').trim()]
            if (target && p.link !== target) {
              p.link = target
              touched = true
            }
          }
        }
      }
      if (touched) {
        await payload.update({
          collection: 'pages',
          id: page.id,
          data: { layout: page.layout, _status: 'published' },
        })
        payload.logger.info('✅ Liens des piliers branchés sur /expertises/*.')
      } else {
        payload.logger.info('ℹ️ Aucun lien de pilier à mettre à jour (titres non trouvés ?).')
      }
    }
  } catch (err) {
    payload.logger.warn(`⚠️ Liens des piliers non mis à jour automatiquement : ${String(err)}`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
