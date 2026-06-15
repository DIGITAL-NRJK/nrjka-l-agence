/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Injecte le contenu rédactionnel (description longue sourcée + objectifs + FAQ) dans les 16
 * services (hors pilote Maintenance/Support, déjà fait).
 * Lancement : pnpm payload run src/scripts/seed-services-content.ts
 * Sources : voir le document NRJKA-contenu-services.md (Sucuri, Baymard, Deloitte×Google,
 * Lucidpress/Marq, Backlinko/SEJ, Smartsheet/Formstack).
 */
// Convertisseur Markdown → Lexical (manuel, sans dépendance fragile)
const txt = (text: string, bold = false) => ({
  detail: 0,
  format: bold ? 1 : 0,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})
const inline = (s: string) =>
  s
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((p) => {
      const b = p.startsWith('**') && p.endsWith('**')
      return txt(b ? p.slice(2, -2) : p, b)
    })
const heading = (tag: string, s: string) => ({
  children: inline(s),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'heading',
  version: 1,
  tag,
})
const paragraph = (s: string) => ({
  children: inline(s),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1,
  textFormat: 0,
  textStyle: '',
})
const toLexical = (md: string) => {
  const children: any[] = []
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('### ')) children.push(heading('h3', line.slice(4)))
    else if (line.startsWith('## ')) children.push(heading('h2', line.slice(3)))
    else children.push(paragraph(line))
  }
  return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
}

type SvcContent = {
  slug: string
  why: string
  partenariat: string
  benefits: string[]
  faqs: { question: string; answer: string }[]
}

const services: SvcContent[] = [
  // ——— Marque & Contenu ———
  {
    slug: 'branding-identite',
    why: 'Une marque incohérente se dilue : on ne s’en souvient pas, on hésite à lui faire confiance. À l’inverse, une présentation cohérente partout (logo, couleurs, ton) **augmente le chiffre d’affaires de 23 % à 33 %** selon les rapports Lucidpress/Marq. Pourtant, 95 % des entreprises ont une charte… et seules 30 % l’appliquent vraiment.',
    partenariat: 'On construit un système complet (logo, palette, typographies, règles d’usage) livré dans un brand book clair, avec tous les fichiers sources. Vous restez propriétaire et autonome — sans dépendance à un prestataire.',
    benefits: ['Reconnaissance immédiate', 'Confiance renforcée', 'Cohérence sur tous les supports', 'Différenciation claire'],
    faqs: [
      { question: 'Quelle différence entre un logo et une identité de marque ?', answer: 'Un logo est un signe ; l’identité est le système complet (couleurs, typographies, ton, règles) qui rend la marque cohérente et reconnaissable partout.' },
      { question: 'Les fichiers sources sont-ils livrés ?', answer: 'Toujours, avec les droits associés. Vous restez propriétaire de votre marque.' },
    ],
  },
  {
    slug: 'strategie-copywriting',
    why: 'Avant le design, il y a le message. Un positionnement flou fait fuir : le visiteur ne comprend pas en quelques secondes ce que vous faites, ni pour qui. La cohérence de message participe directement au **+23 % de revenus** associé à une marque cohérente (Lucidpress/Marq).',
    partenariat: 'On définit votre positionnement, votre ton de voix et vos messages clés, puis on rédige des contenus qui parlent à vos clients — sans jargon. Vous repartez avec une base réutilisable partout.',
    benefits: ['Positionnement clair', 'Message qui résonne', 'Ton reconnaissable', 'Conversion facilitée'],
    faqs: [
      { question: 'Vous rédigez les textes du site ?', answer: 'Oui, le copywriting et le ton de voix font partie de la prestation.' },
      { question: 'Travaillez-vous à partir de l’existant ?', answer: 'Oui, on part de votre matière et on clarifie ce qui doit l’être.' },
    ],
  },
  {
    slug: 'direction-artistique',
    why: 'Des visuels disparates brouillent le message et affaiblissent la marque. Une direction artistique tenue garantit l’impact et la cohérence — un levier du **+23 % à +33 % de revenus** lié à la cohérence de marque (Lucidpress/Marq).',
    partenariat: 'On cadre la création (moodboards, guidelines, direction photo) et on supervise vos contenus visuels pour qu’ils restent cohérents, quel que soit le support. Les guidelines vous appartiennent.',
    benefits: ['Impact visuel', 'Cohérence totale', 'Qualité perçue', 'Mémorisation'],
    faqs: [
      { question: 'C’est utile si j’ai déjà un logo ?', answer: 'Oui : la direction artistique assure la cohérence bien au-delà du logo, sur tous vos supports.' },
      { question: 'Vous produisez les visuels ?', answer: 'On peut créer ou superviser selon votre besoin et votre budget.' },
    ],
  },
  {
    slug: 'communication',
    why: 'Communiquer sans plan, c’est s’épuiser pour peu de résultats. Un plan multi-canal et un calendrier éditorial concentrent les efforts là où ça compte — et nourrissent la cohérence qui pèse jusqu’à **+33 % de revenus** (Lucidpress/Marq).',
    partenariat: 'On bâtit un plan réaliste (audit, axes, calendrier, KPIs) adapté à votre temps disponible. L’objectif : une communication qui tourne sans vous épuiser.',
    benefits: ['Toucher la bonne cible', 'Régularité tenable', 'Message cohérent', 'Résultats mesurés'],
    faqs: [
      { question: 'Je n’ai pas le temps de communiquer.', answer: 'Justement : on cadre un rythme tenable et un calendrier, pour que ça tourne sans vous épuiser.' },
      { question: 'Vous gérez la publication ?', answer: 'Au choix : on cadre la stratégie, ou on exécute aussi la publication.' },
    ],
  },
  // ——— Web & Expérience ———
  {
    slug: 'sites-vitrines',
    why: 'La vitesse fait vendre : selon l’étude Deloitte × Google « Milliseconds Make Millions », **0,1 s gagné** à l’affichage augmente les conversions de **+8,4 % dans l’e-commerce** (et plus encore ailleurs). Et **près d’un visiteur mobile sur deux quitte** un site qui met plus de 3 secondes à charger.',
    partenariat: 'On conçoit un site sur-mesure, rapide et optimisé, sur des technologies ouvertes (WordPress, headless) que vous possédez — contenu, données, hébergement. Formation incluse.',
    benefits: ['Plus de contacts générés', 'Image professionnelle', 'Site rapide et mobile', 'Autonomie de mise à jour'],
    faqs: [
      { question: 'Serai-je autonome pour modifier mon site ?', answer: 'Oui : back-office clair et formation incluse. Vous éditez vos contenus sans dépendre de nous.' },
      { question: 'Combien de temps pour un site vitrine ?', answer: 'Quelques semaines selon le périmètre, avec des jalons clairs dès le départ.' },
    ],
  },
  {
    slug: 'e-commerce',
    why: 'En moyenne, **près de 7 paniers sur 10 sont abandonnés** (70,2 %, Institut Baymard). Bonne nouvelle : un tunnel de commande mieux conçu peut faire **gagner jusqu’à +35 % de conversions** sur les problèmes d’ergonomie corrigeables. Le détail compte.',
    partenariat: 'On déploie une boutique performante sur WooCommerce, PrestaShop ou Medusa (open source) — vous gardez la main, sans commission de plateforme ni dépendance.',
    benefits: ['Plus de ventes finalisées', 'Parcours d’achat fluide', 'Gestion simple (stocks, paiement)', 'Boutique que vous possédez'],
    faqs: [
      { question: 'Pourquoi pas Shopify ?', answer: 'Pour éviter de louer votre boutique et de subir des frais récurrents. Avec l’open source, vous hébergez et possédez réellement votre commerce.' },
      { question: 'Vous gérez paiements et livraison ?', answer: 'Oui, intégrés et testés selon votre activité.' },
    ],
  },
  {
    slug: 'sites-institutionnels',
    why: 'Sur les projets d’envergure (multi-sites, portails), la rigueur technique évite des coûts cachés énormes. Performance et accessibilité ne sont pas optionnelles : la vitesse pèse sur l’engagement (Deloitte × Google), et l’accessibilité (RGAA) est une obligation pour de nombreux acteurs.',
    partenariat: 'On structure un socle évolutif et documenté, pensé pour durer et pour être repris par vos équipes. Pas de boîte noire.',
    benefits: ['Architecture robuste', 'Accessibilité RGAA', 'Scalabilité', 'Gouvernance de contenu claire'],
    faqs: [
      { question: 'Gérez-vous l’accessibilité RGAA ?', answer: 'Oui, intégrée dès la conception (et pas en correctif de dernière minute).' },
      { question: 'Le multi-sites est-il possible ?', answer: 'Oui, avec une gouvernance de contenu claire et une architecture pensée pour ça.' },
    ],
  },
  {
    slug: 'headless-sur-mesure',
    why: 'Pour les projets ambitieux, l’architecture découplée (headless) offre une **performance maximale** — or chaque dixième de seconde compte (Deloitte × Google : +8,4 % de conversions e-commerce pour 0,1 s gagné). Flexibilité et rapidité, sans compromis.',
    partenariat: 'On construit sur des briques ouvertes (Next.js, Payload) que vous maîtrisez, avec une documentation claire. Pas de dépendance à un éditeur.',
    benefits: ['Performance maximale', 'Flexibilité totale', 'Évolutivité', 'Indépendance technologique'],
    faqs: [
      { question: 'Le headless, c’est pour qui ?', answer: 'Pour les besoins spécifiques ou la performance maximale. Pour la plupart des sites, une solution classique suffit — on vous conseille honnêtement.' },
      { question: 'Est-ce plus cher ?', answer: 'Plus exigeant techniquement. On recommande la solution adaptée à votre projet, pas la plus chère.' },
    ],
  },
  // ——— Performance & Visibilité ———
  {
    slug: 'seo-aio',
    why: 'Être en page 2 de Google, c’est être invisible : **la page 1 capte plus de 71 % des clics**, et les 3 premiers résultats à eux seuls **~68,7 %** (Backlinko, Search Engine Journal). Et désormais il faut aussi être lisible par les IA (ChatGPT, Perplexity, Claude) — c’est l’AIO.',
    partenariat: 'On combine SEO technique, contenu utile et optimisation IA, mesurés en clair avec Matomo (souverain). On vise des progrès réels et durables, pas des promesses.',
    benefits: ['Visibilité durable', 'Trafic qualifié', 'Présence dans les réponses IA', 'Croissance non dépendante de la pub'],
    faqs: [
      { question: 'En combien de temps des résultats ?', answer: 'Les premiers effets apparaissent en 2 à 4 mois, puis s’installent durablement.' },
      { question: 'Garantissez-vous la première place ?', answer: 'Personne ne peut le garantir honnêtement — Google seul décide. On s’engage sur une méthode et des progrès mesurés.' },
    ],
  },
  {
    slug: 'publicite-digitale',
    why: 'La publicité achète une visibilité immédiate — utile pour lancer ou compléter le SEO. Mais sans méthode, le budget s’évapore. La clé : cibler juste, mesurer, et arbitrer en continu pour un coût par acquisition maîtrisé.',
    partenariat: 'On pilote des campagnes orientées résultat (Google Ads, Social Ads), avec un reporting clair. Vous gardez la propriété de vos comptes et de vos données.',
    benefits: ['Trafic immédiat', 'Budget maîtrisé', 'Conversions mesurées', 'Apprentissages réutilisables'],
    faqs: [
      { question: 'Publicité ou SEO ?', answer: 'Les deux se complètent : la pub amorce vite, le SEO installe une visibilité durable.' },
      { question: 'Petit budget, est-ce utile ?', answer: 'Oui, à condition de cibler serré. On cadre ensemble pour éviter le gaspillage.' },
    ],
  },
  {
    slug: 'social-media',
    why: 'Les réseaux sociaux entretiennent la relation et la notoriété — à condition d’être cohérent et régulier. Une présence dispersée fatigue sans résultat ; une présence cadrée nourrit la marque (cohérence = jusqu’à +33 % de revenus, Lucidpress/Marq).',
    partenariat: 'On définit une stratégie éditoriale réaliste, on crée des contenus alignés sur votre marque, et on peut gérer la publication. Sans vous enfermer dans une cadence intenable.',
    benefits: ['Notoriété', 'Lien avec votre audience', 'Cohérence de marque', 'Régularité tenable'],
    faqs: [
      { question: 'Quels réseaux pour mon activité ?', answer: 'Ceux où se trouvent vos clients — on les choisit ensemble plutôt que d’être partout.' },
      { question: 'Faut-il publier tous les jours ?', answer: 'Non : mieux vaut régulier et utile que fréquent et creux.' },
    ],
  },
  {
    slug: 'analytics-data',
    why: 'Décider sans données, c’est piloter à l’aveugle. Mais la donnée doit rester **la vôtre** : on privilégie Matomo (open source, respectueux de la vie privée) plutôt que des outils qui revendent l’audience — c’est plus simple côté RGPD, et vos données restent chez vous.',
    partenariat: 'On met en place une mesure fiable et lisible (Matomo, Metabase) avec des tableaux de bord clairs et un reporting mensuel. Vous comprenez enfin vos chiffres.',
    benefits: ['Décisions éclairées', 'Suivi des conversions', 'Conformité RGPD', 'Données souveraines'],
    faqs: [
      { question: 'Pourquoi Matomo plutôt que Google Analytics ?', answer: 'Vos données d’audience vous appartiennent et restent hébergées chez vous, sans partage publicitaire — et la conformité RGPD est simplifiée.' },
      { question: 'C’est compliqué à lire ?', answer: 'On le rend simple : des tableaux de bord clairs pour décider sans être expert.' },
    ],
  },
  // ——— Digitalisation & Process (hors Maintenance, déjà faite) ———
  {
    slug: 'erp-dolibarr',
    why: 'La double saisie coûte cher : **un employé de bureau passe ~10 % de son temps à de la saisie manuelle** dans des outils type ERP/CRM/tableurs (Smartsheet/Formstack). Un ERP bien posé supprime ces pertes et fiabilise vos chiffres.',
    partenariat: 'On installe et configure Dolibarr (open source) sur-mesure, on l’intègre à votre site, et on forme vos équipes. Vous gardez le contrôle, sans licence par utilisateur.',
    benefits: ['Zéro double saisie', 'Gestion centralisée (devis, factures, stocks)', 'Données fiables', 'Outil que vous possédez'],
    faqs: [
      { question: 'Dolibarr est-il adapté à une petite structure ?', answer: 'Oui : modulaire, on n’active que ce dont vous avez besoin. Open source et économique.' },
      { question: 'Où sont mes données ?', answer: 'Hébergées chez vous : elles vous appartiennent.' },
    ],
  },
  {
    slug: 'crm-notion',
    why: 'La coordination manuelle ronge le temps : **51 % des employés passent au moins 2 h/jour sur des tâches répétitives** (saisie, mises à jour, reporting) selon Smartsheet. Un CRM/espace de gestion bien pensé rend ce temps à votre activité.',
    partenariat: 'On conçoit un écosystème (Notion ou CRM open source) sur-mesure, avec automatisations et tableaux de bord, puis on forme vos équipes. Pas de dépendance.',
    benefits: ['Suivi clients sans rien oublier', 'Équipes alignées', 'Process documentés', 'Gain de temps quotidien'],
    faqs: [
      { question: 'Notion suffit-il comme CRM ?', answer: 'Souvent oui pour démarrer : on l’adapte précisément à votre métier.' },
      { question: 'Mes données sont-elles en sécurité ?', answer: 'On cadre les accès et les sauvegardes pour protéger vos informations.' },
    ],
  },
  {
    slug: 'automatisation-n8n',
    why: '**Plus de 40 % des actifs passent au moins un quart de leur semaine** sur des tâches manuelles répétitives (Smartsheet) — et l’automatisation réduit ce temps de **~50 %** chez ceux qui l’adoptent (Formstack). Autant de temps rendu à votre métier.',
    partenariat: 'On cartographie vos process, on connecte vos outils et on automatise vos flux avec n8n auto-hébergé — pas de coût à la tâche, vos flux restent souverains.',
    benefits: ['Fin des tâches répétitives', 'Zéro oubli', 'Process fiabilisés', 'Outils connectés entre eux'],
    faqs: [
      { question: 'Pourquoi n8n plutôt que Make ou Zapier ?', answer: 'Pas de facturation à l’usage, contrôle total et données chez vous. Vos automatisations restent souveraines.' },
      { question: 'Un exemple concret ?', answer: 'Une commande sur votre site qui crée automatiquement la facture et met à jour le stock, sans intervention.' },
    ],
  },
  {
    slug: 'formation',
    why: 'Un outil mal maîtrisé ne sert à rien — et crée une dépendance au prestataire. La formation transforme l’investissement en **autonomie réelle** : vos équipes pilotent, vous ne dépendez de personne pour le quotidien.',
    partenariat: 'Sessions personnalisées, documentation claire et tutoriels : on forme à VOS outils (WordPress, Dolibarr, Notion, Matomo…) pour que vous soyez libres. Support post-formation inclus.',
    benefits: ['Autonomie des équipes', 'Outils réellement utilisés', 'Moins de dépendance', 'Montée en compétences durable'],
    faqs: [
      { question: 'Formation à distance ou sur site ?', answer: 'Les deux, selon votre préférence et votre organisation.' },
      { question: 'Et après la formation ?', answer: 'Documentation et support post-formation pour ancrer durablement les acquis.' },
    ],
  },
]

export type SeedResult = { slug: string; ok: boolean; error?: string }

// Reçoit une instance Payload déjà initialisée (appelée depuis une route du serveur dev,
// qui se connecte correctement à la base — contrairement à `payload run` en standalone).
export async function seedServicesContent(payload: any): Promise<SeedResult[]> {
  const results: SeedResult[] = []
  for (const s of services) {
    try {
      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: s.slug } },
        limit: 1,
        pagination: false,
      })
      if (!existing.docs[0]) {
        results.push({ slug: s.slug, ok: false, error: 'introuvable (lance seed-expertises)' })
        continue
      }
      const md = `## Pourquoi c'est important\n\n${s.why}\n\n## Notre proposition de partenariat\n\n${s.partenariat}`
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data: {
          long_description: toLexical(md),
          benefits: s.benefits.map((benefit) => ({ benefit })),
          faqs: s.faqs,
        } as any,
      })
      results.push({ slug: s.slug, ok: true })
    } catch (err) {
      results.push({ slug: s.slug, ok: false, error: err instanceof Error ? err.message : String(err) })
    }
  }
  return results
}
