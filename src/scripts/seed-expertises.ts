/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Modèle deux niveaux :
 *  - Pôles (collection « expertises ») : les 4 grands domaines, mis en avant sur la home.
 *  - Services (collection « services ») : les offres granulaires, rattachées à un pôle.
 * Crée/MAJ les 4 pôles + leurs services (dont Formation & Maintenance sous Digitalisation),
 * et nettoie les anciennes entrées Services en double.
 * Lancement : pnpm payload run src/scripts/seed-expertises.ts
 */
import { toLexical } from './_md-to-lexical'

type Pole = {
  slug: string
  title: string
  icon: string
  subtitle: string
  description: string
  long: string
  highlights: string[]
  benefits: string[]
  process: { title: string; description: string }[]
  technologies: string[]
  faqs: { question: string; answer: string }[]
}

const poles: Pole[] = [
  {
    slug: 'marque-contenu',
    title: 'Marque & Contenu',
    icon: 'Palette',
    subtitle: 'Stratégie, Design, Création',
    description:
      'Une marque claire, cohérente et mémorable — du positionnement à la charte graphique, du message aux contenus.',
    long: `Avant la technique, il y a le sens. Nous posons d'abord les fondations de votre marque : ce que vous êtes, ce que vous promettez, et à qui.

De ce socle découlent une identité visuelle juste, un ton de voix reconnaissable et des contenus qui portent votre valeur. Pas de gadgets : une cohérence totale, sur chaque support, qui installe la confiance et facilite tout le reste de votre présence digitale.

## Pour qui ?
TPE, PME, artisans et associations qui veulent enfin une présence à la hauteur de leur travail — qu'il s'agisse de créer une marque de zéro, de la clarifier, ou de la faire grandir.

## Comment on travaille
On part de votre réalité, pas d'un modèle. On comprend votre métier, vos clients et ce qui vous distingue vraiment, puis on en tire un positionnement clair, une identité qui vous ressemble et des messages qui parlent — sans jargon. Le résultat : une marque qui inspire confiance dès le premier contact, se décline sans effort, et que vous gardez en main grâce à un brand book et des fichiers sources qui vous appartiennent.`,
    highlights: ['Branding', 'Identité visuelle', 'Copywriting', 'Direction artistique'],
    benefits: ['Reconnaissance immédiate', 'Positionnement clair', 'Connexion émotionnelle', 'Cohérence totale'],
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
        question: 'Les fichiers sources sont-ils livrés ?',
        answer:
          'Toujours. Vous récupérez l’ensemble des fichiers sources et des droits associés. Notre principe : vous restez propriétaire de votre marque, sans dépendance à un prestataire.',
      },
      {
        question: 'Quelle différence entre un logo et une identité de marque ?',
        answer:
          'Un logo est un signe. Une identité de marque, c’est le système complet — logo, couleurs, typographies, ton de voix, règles d’usage — qui rend votre marque reconnaissable et cohérente sur tous vos supports.',
      },
      {
        question: 'Pouvez-vous refondre ma marque sans tout changer ?',
        answer:
          'Oui. On part de l’existant, on garde ce qui fonctionne et on clarifie le reste. Une refonte n’est pas forcément une révolution : souvent, remettre de la cohérence suffit à tout changer.',
      },
      {
        question: 'Rédigez-vous aussi les textes (copywriting) ?',
        answer:
          'Oui. Le positionnement, le ton de voix et la rédaction de vos contenus font partie de ce pôle. Une belle identité sans les bons mots reste muette.',
      },
      {
        question: 'Combien coûte une identité de marque ?',
        answer:
          'Cela dépend du périmètre. On raisonne en valeur, avec un devis sur-mesure établi après un audit gratuit — transparent, sans coût caché. Vous repartez propriétaire de tous les fichiers.',
      },
    ],
  },
  {
    slug: 'web-experience',
    title: 'Web & Expérience',
    icon: 'Globe',
    subtitle: 'Sites & E-commerce',
    description:
      'Des sites et e-commerce sur-mesure, rapides et évolutifs — pensés pour convertir, et pour vous appartenir.',
    long: `Un site n'est pas qu'une vitrine : c'est votre meilleur commercial, disponible en continu. Nous concevons des plateformes performantes, accessibles et faciles à faire vivre.

Nous privilégions des technologies ouvertes et souveraines — WordPress, WooCommerce, PrestaShop, Medusa ou du headless sur-mesure — pour que vous ne soyez jamais prisonnier d'un outil. Vous gardez la main sur votre contenu, vos données et votre hébergement.

## Un site qui performe, pas qui pèse
Vitesse, accessibilité, référencement : on soigne les fondations techniques dès la conception. Un site rapide et bien structuré, c'est plus de visiteurs convertis, un meilleur classement Google, et une expérience irréprochable sur mobile comme sur ordinateur.

## Et après le lancement ?
On ne disparaît pas une fois le site en ligne. Formation incluse pour que vous soyez autonome, documentation claire, et plans de maintenance si vous le souhaitez. Votre site est un actif qui grandit avec vous — pas un projet qu'on referme.`,
    highlights: ['Sites vitrines', 'E-commerce', 'Headless CMS', 'UX/UI Design'],
    benefits: ['100% responsive', 'Core Web Vitals A+', 'SEO-ready', 'Sécurisé & souverain'],
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
          'Shopify est pratique mais c’est une location : vos données et votre boutique vivent chez un tiers, avec des frais et des limites. Nous préférons des solutions open source comme WooCommerce, PrestaShop ou Medusa, que vous hébergez et possédez réellement.',
      },
      {
        question: 'Serai-je autonome pour modifier mon site ?',
        answer:
          'Oui, c’est un objectif central. On choisit un back-office clair, et la formation est incluse. Vous éditez vos pages et vos contenus sans dépendre de nous au quotidien.',
      },
      {
        question: 'Combien coûte un site web ?',
        answer:
          'Le prix dépend du périmètre (vitrine, e-commerce, sur-mesure). On établit un devis clair après un audit gratuit — sans coût caché, et sans abonnement qui vous enferme. Vous restez propriétaire du site et de son hébergement.',
      },
      {
        question: 'WordPress ou développement sur-mesure : que choisir ?',
        answer:
          'WordPress convient à la majorité des projets : autonome, éprouvé, riche en extensions. Le headless / sur-mesure (Next.js, Payload) est réservé aux besoins spécifiques ou à la performance maximale. On vous conseille la solution la plus adaptée, pas la plus chère.',
      },
      {
        question: 'Mon site sera-t-il bien référencé sur Google ?',
        answer:
          'Les bonnes pratiques SEO et la performance sont intégrées dès la conception (structure, vitesse, balises). Le référencement de fond — contenu, mots-clés, netlinking — est un travail dédié, géré par le pôle Performance & Visibilité.',
      },
      {
        question: 'Puis-je vendre en ligne ?',
        answer:
          'Oui. Selon votre projet, on déploie WooCommerce, PrestaShop ou Medusa — des solutions e-commerce open source que vous possédez, avec gestion des produits, des paiements et des stocks.',
      },
      {
        question: 'Reprenez-vous un site existant ?',
        answer:
          'Oui. Après un audit, on peut refondre votre site, le reprendre pour le faire évoluer, ou le migrer vers une solution plus saine — sans repartir de zéro si ce n’est pas nécessaire.',
      },
    ],
  },
  {
    slug: 'performance-visibilite',
    title: 'Performance & Visibilité',
    icon: 'TrendingUp',
    subtitle: 'SEO, SEA, AIO',
    description:
      'Référencement naturel, optimisation pour les moteurs IA (AIO) et campagnes ROIstes — une visibilité durable et mesurable.',
    long: `La visibilité ne s'improvise pas et ne s'achète pas durablement. Nous combinons un SEO technique solide, des contenus utiles et une optimisation pour les nouveaux moteurs IA (ChatGPT, Perplexity, Claude).

Tout est mesuré, en clair. Nous privilégions des outils respectueux de la vie privée comme Matomo, pour que vos données d'audience restent les vôtres — et que vos décisions s'appuient sur des chiffres fiables.

## SEO, SEA, AIO : la bonne combinaison
Le référencement naturel (SEO) construit une visibilité durable ; la publicité (SEA) apporte un trafic immédiat ; l'optimisation IA (AIO) vous rend visible là où vos clients cherchent désormais — dans les réponses de ChatGPT, Perplexity ou Claude. On dose ces trois leviers selon vos objectifs et votre budget, sans jamais vous enfermer dans une dépense permanente.

## Honnêteté avant tout
On ne vous promet pas la première place du jour au lendemain — personne de sérieux ne le fait. On s'engage sur une méthode, des priorités claires et des progrès mesurés, mois après mois.`,
    highlights: ['SEO & AIO', 'Google Ads', 'Social Media', 'Analytics'],
    benefits: ['Visibilité accrue', 'Trafic qualifié', 'ROI mesurable', 'IA-ready'],
    process: [
      { title: 'Audit', description: 'État des lieux technique, contenu et concurrence.' },
      { title: 'Stratégie', description: 'Priorités, mots-clés et plan de contenu.' },
      { title: 'Exécution', description: 'Optimisations on-page, contenus, campagnes.' },
      { title: 'Mesure', description: 'Suivi des positions, du trafic et du ROI.' },
    ],
    technologies: ['Matomo (open source)', 'Google Search Console', 'Metabase', 'Schema.org'],
    faqs: [
      {
        question: "C'est quoi l'AIO, et pourquoi ça compte ?",
        answer:
          'L’AIO (AI Optimization) rend votre site lisible et citable par les moteurs IA comme ChatGPT, Perplexity ou Claude — qui répondent de plus en plus aux recherches. On optimise structure, données structurées et contenu pour être compris et recommandé par ces nouveaux acteurs.',
      },
      {
        question: 'Pourquoi Matomo plutôt que Google Analytics ?',
        answer:
          'Matomo est open source et respecte la vie privée : vos données d’audience vous appartiennent et restent hébergées chez vous, sans partage publicitaire. C’est cohérent avec notre approche souveraine et souvent plus simple côté RGPD.',
      },
      {
        question: 'En combien de temps voit-on des résultats en SEO ?',
        answer:
          'Le SEO est un investissement de fond : les premiers effets apparaissent souvent en 2 à 4 mois, puis s’installent durablement. On commence par les gains rapides (technique, pages clés) pendant que la stratégie de contenu monte en puissance.',
      },
      {
        question: 'Quelle différence entre SEO et SEA ?',
        answer:
          'Le SEO (référencement naturel) construit une visibilité durable et gratuite dans le temps. Le SEA (publicité) achète une visibilité immédiate, tant que vous payez. On combine les deux selon vos objectifs et votre budget.',
      },
      {
        question: 'Garantissez-vous la première place sur Google ?',
        answer:
          'Personne ne peut le garantir honnêtement — Google seul décide. Ce sur quoi on s’engage : une méthode rigoureuse, des actions priorisées et des progrès mesurés, en toute transparence.',
      },
      {
        question: 'Gérez-vous aussi les réseaux sociaux ?',
        answer:
          'Oui : stratégie éditoriale, création de contenu et community management font partie de ce pôle, en cohérence avec votre marque et vos objectifs de visibilité.',
      },
      {
        question: 'Combien coûte une prestation SEO ou une campagne ?',
        answer:
          'Cela dépend de vos objectifs et de votre marché. On établit un devis après un audit gratuit, et on privilégie toujours les actions au meilleur rapport impact/coût.',
      },
    ],
  },
  {
    slug: 'digitalisation-process',
    title: 'Digitalisation & Process',
    icon: 'Database',
    subtitle: 'ERP, CRM, Automatisation',
    description:
      'ERP, CRM et automatisations pour éliminer la double saisie et gagner du temps — avec des outils open source que vous maîtrisez.',
    long: `La vraie productivité, c'est arrêter de perdre du temps sur des tâches répétitives. Nous connectons vos outils et automatisons vos flux pour supprimer les doubles saisies et les oublis.

Notre parti pris : des briques open source et auto-hébergeables — Dolibarr pour l'ERP/CRM, n8n pour l'automatisation — pour que vos process et vos données restent chez vous. On vous forme à les piloter, pour une autonomie réelle.

## Ce que ça change au quotidien
Une commande sur votre site qui crée automatiquement la facture et met à jour le stock. Un nouveau contact qui atterrit directement dans votre CRM. Des relances envoyées sans y penser. Autant de tâches qui ne vous coûtent plus ni temps, ni erreurs.

## Maintenance & Formation incluses
On documente tout, on forme vos équipes, et on propose des plans de maintenance (mises à jour, sauvegardes, supervision) pour que votre système reste fiable dans la durée — sans jamais vous rendre captifs. Vous gardez la main, on reste à vos côtés si besoin.`,
    highlights: ['ERP Dolibarr', 'CRM Notion', 'Automatisation', 'Maintenance & Formation'],
    benefits: ['Gain de temps', 'Zéro double saisie', 'Process documentés', 'Équipe autonome'],
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
          'Make et Zapier sont efficaces mais facturés à l’usage et hébergés chez des tiers. Avec n8n auto-hébergé, vous gardez le contrôle complet, sans coût à la tâche — et vos flux restent souverains.',
      },
      {
        question: 'Vais-je dépendre de vous pour faire tourner tout ça ?',
        answer:
          'Non, c’est tout l’inverse de notre promesse. On documente vos process et on forme vos équipes pour que vous soyez autonomes. On reste disponible pour les évolutions, jamais comme un point de blocage.',
      },
      {
        question: 'Dolibarr est-il adapté à une petite structure ?',
        answer:
          'Oui. Dolibarr est modulaire : on n’active que ce dont vous avez besoin (devis, factures, stocks, CRM). C’est open source, économique et évolutif — idéal pour les TPE/PME et les associations qui veulent se structurer sans s’enfermer.',
      },
      {
        question: 'Pouvez-vous connecter mon site à mon outil de gestion ?',
        answer:
          'Oui. On met en place la synchronisation site ↔ ERP : une commande sur votre site crée automatiquement la facture, met à jour le stock, etc. Fini la double saisie.',
      },
      {
        question: 'Qu’est-ce que l’automatisation peut me faire gagner concrètement ?',
        answer:
          'Du temps, surtout. On supprime les tâches répétitives, les copier-coller entre outils et les oublis. Vos équipes se concentrent sur ce qui a de la valeur, pas sur la saisie.',
      },
      {
        question: 'Proposez-vous de la formation à ces outils ?',
        answer:
          'Oui, la formation est au cœur du pôle : sessions personnalisées, documentation et tutoriels pour rendre vos équipes vraiment autonomes.',
      },
      {
        question: 'Et la maintenance, une fois en place ?',
        answer:
          'On propose des plans de maintenance adaptés (mises à jour, sauvegardes, supervision) si vous le souhaitez — sans jamais vous rendre captifs. Vous gardez la main.',
      },
    ],
  },
]

// Services granulaires rattachés à chaque pôle (slug du pôle -> services)
type SeedService = { slug: string; title: string; description: string; besoins?: string[] }

const servicesByPole: Record<string, SeedService[]> = {
  'marque-contenu': [
    { slug: 'branding-identite', title: 'Branding & Identité', description: 'Logo, palette, typographie : un système graphique complet et cohérent.', besoins: ['Logo & déclinaisons', 'Charte graphique', 'Brand book complet', "Refonte d'identité"] },
    { slug: 'strategie-copywriting', title: 'Stratégie & Copywriting', description: 'Positionnement, ton de voix et messages qui résonnent avec votre audience.', besoins: ['Positionnement de marque', 'Tone of voice', 'Messages clés', 'Copywriting web'] },
    { slug: 'direction-artistique', title: 'Direction artistique', description: 'Supervision créative de vos visuels, pour un impact cohérent partout.', besoins: ['Direction photo', 'Moodboards', 'Guidelines visuels', "Création d'assets"] },
    { slug: 'communication', title: 'Communication', description: 'Plan multi-canal et calendrier éditorial pour toucher la bonne cible au bon moment.', besoins: ['Audit concurrentiel', 'Plan de communication', 'Calendrier éditorial', 'KPIs & suivi'] },
  ],
  'web-experience': [
    { slug: 'sites-vitrines', title: 'Sites vitrines', description: 'Des sites sur-mesure, rapides et optimisés SEO, faciles à faire vivre.', besoins: ['Site vitrine sur-mesure', 'Refonte de site', 'Optimisation UX/UI', 'Blog / actualités'] },
    { slug: 'e-commerce', title: 'E-commerce', description: 'Boutiques performantes sur WooCommerce, PrestaShop ou Medusa — que vous possédez.', besoins: ['Boutique WooCommerce', 'Boutique PrestaShop / Medusa', 'Paiement & livraison', 'Migration e-commerce'] },
    { slug: 'sites-institutionnels', title: 'Sites institutionnels', description: "Projets d'envergure : multi-sites, portails, accessibilité RGAA.", besoins: ['Multi-sites', 'Intranet / portail', 'Accessibilité RGAA', "Refonte d'envergure"] },
    { slug: 'headless-sur-mesure', title: 'Headless & sur-mesure', description: 'Architecture découplée (Next.js, Payload) pour les projets ambitieux.', besoins: ['Application web', 'Architecture headless', 'API & intégrations', 'Performance maximale'] },
  ],
  'performance-visibilite': [
    { slug: 'seo-aio', title: 'SEO & AIO', description: 'Référencement naturel et optimisation pour les moteurs IA (ChatGPT, Perplexity, Claude).', besoins: ['Audit SEO technique', 'Stratégie de contenu', 'Référencement local', 'Optimisation IA (AIO)'] },
    { slug: 'publicite-digitale', title: 'Publicité digitale', description: 'Campagnes Google Ads et Social Ads orientées ROI, budget maîtrisé.', besoins: ['Google Ads', 'Meta Ads', 'Remarketing', 'A/B testing'] },
    { slug: 'social-media', title: 'Social media', description: 'Stratégie éditoriale, création de contenu et community management.', besoins: ['Stratégie éditoriale', 'Création de contenu', 'Community management', 'Analyse de performance'] },
    { slug: 'analytics-data', title: 'Analytics & data', description: 'Tableaux de bord clairs (Matomo, Metabase) pour décider sur des faits.', besoins: ['Mise en place Matomo', 'Tableaux de bord', 'Suivi des conversions', 'Reporting mensuel'] },
  ],
  'digitalisation-process': [
    { slug: 'erp-dolibarr', title: 'ERP Dolibarr', description: "Gestion d'entreprise open source : devis, factures, stocks, CRM intégré.", besoins: ['Installation & configuration', 'Modules sur-mesure', 'Intégration e-commerce', 'Formation équipe'] },
    { slug: 'crm-notion', title: 'CRM & Notion', description: 'Écosystèmes de gestion clients et projets, sur-mesure et automatisés.', besoins: ['Architecture sur-mesure', 'Bases de données liées', 'Dashboards automatisés', 'Templates métier'] },
    { slug: 'automatisation-n8n', title: 'Automatisation n8n', description: 'Connectez vos outils et supprimez la double saisie, en auto-hébergé.', besoins: ['Audit des process', "Connexion d'outils", 'Workflows automatisés', 'Migration de données'] },
    { slug: 'formation', title: 'Formation', description: 'On vous forme à vos outils pour une autonomie réelle, sans dépendance.', besoins: ['WordPress — administration & contenu', 'Dolibarr ERP — facturation, stocks, CRM', 'Notion — CRM & gestion de projet', 'Matomo & analytics', 'Emailing & marketing (Listmonk, Mautic)', 'SEO & rédaction web'] },
    { slug: 'maintenance-support', title: 'Maintenance & Support', description: 'Mises à jour, sauvegardes, supervision : votre plateforme reste fiable et sûre.', besoins: ['Maintenance préventive', 'Sécurité & monitoring', 'Infogérance / hébergement', 'Sauvegardes & restauration'] },
  ],
}

// Reçoit une instance Payload (appelée depuis une route du serveur dev).
// N'écrit PAS long_description/benefits/faqs des services (gérés par seedServicesContent) :
// ré-exécutable sans écraser le contenu déjà injecté.
export async function seedExpertises(payload: any) {
  const poleIdBySlug: Record<string, number | string> = {}
  let polesDone = 0
  let servicesDone = 0

  // 1) Upsert des pôles
  for (let i = 0; i < poles.length; i++) {
    const p = poles[i]
    const data: any = {
      title: p.title,
      slug: p.slug,
      icon: p.icon,
      subtitle: p.subtitle,
      description: p.description,
      long_description: toLexical(p.long),
      highlights: p.highlights.map((label) => ({ label })),
      benefits: p.benefits.map((benefit) => ({ benefit })),
      process_steps: p.process,
      technologies: p.technologies.map((name) => ({ name })),
      faqs: p.faqs,
      featured: true,
      published: true,
      order: i + 1,
      seo: { metaTitle: `${p.title} — Expertise NRJKA`, metaDescription: p.description },
    }
    const existing = await payload.find({
      collection: 'expertises',
      where: { slug: { equals: p.slug } },
      limit: 1,
      pagination: false,
    })
    if (existing.docs[0]) {
      const doc = await payload.update({ collection: 'expertises', id: existing.docs[0].id, data })
      poleIdBySlug[p.slug] = doc.id
    } else {
      const doc = await payload.create({ collection: 'expertises', data })
      poleIdBySlug[p.slug] = doc.id
    }
    polesDone += 1
  }

  // 2) Nettoyage : anciennes entrées Services en double (slug = slug de pôle)
  for (const oldSlug of Object.keys(servicesByPole)) {
    const dup = await payload.find({
      collection: 'services',
      where: { slug: { equals: oldSlug } },
      limit: 1,
      pagination: false,
    })
    if (dup.docs[0]) await payload.delete({ collection: 'services', id: dup.docs[0].id })
  }

  // 3) Upsert des services rattachés
  let order = 0
  for (const [poleSlug, list] of Object.entries(servicesByPole)) {
    const poleId = poleIdBySlug[poleSlug]
    for (const s of list) {
      order += 1
      const data: any = {
        title: s.title,
        slug: s.slug,
        description: s.description,
        pole: poleId,
        published: true,
        order,
        besoins: (s.besoins || []).map((label) => ({ label })),
      }
      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: s.slug } },
        limit: 1,
        pagination: false,
      })
      if (existing.docs[0]) await payload.update({ collection: 'services', id: existing.docs[0].id, data })
      else await payload.create({ collection: 'services', data })
      servicesDone += 1
    }
  }

  return { poles: polesDone, services: servicesDone }
}
