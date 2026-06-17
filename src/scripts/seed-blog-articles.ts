/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Articles de blog « Ressources & conseils », approfondis et SOURCÉS (chiffres réels,
 * sources citées par leur nom). Chaque article est :
 *  - publié (_status: 'published'),
 *  - rangé dans une (sous-)catégorie → filtre 2 niveaux du blog,
 *  - rattaché à un service via related_articles → CTA contextuel sur la page article.
 * Crée les sous-catégories manquantes (parent = pôle) et réutilise les existantes.
 *
 * Lots : Performance & Visibilité, Web & Expérience, Marque & Contenu, Digitalisation & Process.
 */
import { toLexical } from './_md-to-lexical'

type SubCat = { title: string; slug: string; parentSlug: string }
type Article = {
  slug: string
  title: string
  description: string
  categorySlug: string
  serviceSlug?: string
  body: string
}

// Sous-catégories à créer si absentes (les autres — Branding, Formation — existent déjà).
const subCategories: SubCat[] = [
  { title: 'SEO & visibilité', slug: 'seo-visibilite', parentSlug: 'performance-visibilite' },
  { title: 'Sites web & UX', slug: 'sites-web-ux', parentSlug: 'web-experience' },
]

const articles: Article[] = [
  // ───────────────────────── Lot 1 — Performance & Visibilité ─────────────────────────
  {
    slug: 'seo-local-trouve-clients-ville',
    title: 'SEO local : comment être trouvé par les clients de votre ville',
    description:
      '80 % des consommateurs cherchent une entreprise locale chaque semaine. Voici comment apparaître au bon moment — données récentes et actions concrètes.',
    categorySlug: 'seo-visibilite',
    serviceSlug: 'seo-aio',
    body: `Quand quelqu'un tape « fleuriste près de moi » ou « comptable [votre ville] », il ne fait pas de la veille : il a une intention immédiate — trouver, puis contacter. Pour une TPE, une PME, un commerce ou une association, être visible sur ces recherches locales est souvent le tout premier point de contact avec un futur client.

## Les recherches locales pèsent (très) lourd

Selon le Local Consumer Review Survey 2024 de BrightLocal, **80 % des consommateurs recherchent une entreprise locale en ligne au moins une fois par semaine**, et près d'un tiers (32 %) le font chaque jour. Toujours d'après BrightLocal, **46 % des internautes ajoutent « près de moi » à leurs recherches « toujours » ou « souvent »**.

Et ces recherches se transforment vite en visites : Google (via Think with Google) estime depuis plusieurs années que **76 % des personnes qui effectuent une recherche locale sur smartphone se rendent dans une entreprise dans la journée**. L'internaute local n'est donc pas en phase de réflexion lointaine — il est prêt à pousser la porte ou à décrocher son téléphone.

## La visibilité locale repose sur trois piliers

Apparaître dans le « pack local » (les trois établissements affichés avec la carte) ne tient pas du hasard. Trois éléments comptent particulièrement :

- **Votre fiche d'établissement Google (Google Business Profile).** C'est la pièce maîtresse. Les professionnels du référencement local interrogés par BrightLocal classent sa gestion comme le levier le plus utile (cité par 76 % d'entre eux). Une fiche complète — horaires, catégorie précise, photos, services, zone desservie — envoie à Google des signaux clairs.
- **Les avis clients.** Leur nombre, leur régularité et vos réponses pèsent à la fois sur le classement et sur la décision : un internaute compare souvent deux ou trois fiches avant de choisir.
- **La cohérence de vos informations.** Le même nom, la même adresse et le même téléphone partout sur le web rassurent Google sur votre existence et votre sérieux.

## Par où commencer, concrètement

Pas besoin d'un gros budget pour progresser. Quelques actions à fort effet :

- **Réclamez et complétez votre fiche Google Business Profile** à 100 % : catégorie principale juste, description, horaires à jour, photos récentes.
- **Demandez des avis** simplement et régulièrement à vos clients satisfaits, et **répondez à tous** — y compris aux négatifs, posément.
- **Vérifiez la cohérence** de vos coordonnées sur votre site, vos réseaux et les annuaires.
- **Ajoutez du contenu local** sur votre site : une page par zone desservie ou par service, qui parle vraiment de votre territoire.

## Une visibilité qui se construit, et qui reste

Contrairement à une campagne publicitaire qui s'arrête dès qu'on coupe le budget, le référencement local s'accumule : une fiche solide, des avis et des pages bien pensées continuent de travailler pour vous mois après mois. C'est un actif, pas une dépense ponctuelle.

Le point de départ, c'est toujours un état des lieux honnête : où apparaissez-vous (ou pas) sur les recherches qui comptent pour votre activité, et qu'est-ce qui bloque ? C'est précisément ce qu'un audit de visibilité permet de clarifier, sans jargon.

**Sources :** BrightLocal — Local Consumer Review Survey 2024 ; Think with Google (recherche locale sur mobile).`,
  },
  {
    slug: 'vitesse-site-impact-chiffre-affaires',
    title: 'Pourquoi la vitesse de votre site pèse sur votre chiffre d’affaires',
    description:
      'Quelques dixièmes de seconde suffisent à faire fuir un visiteur — ou à augmenter vos conversions. Ce que disent les études, et comment accélérer.',
    categorySlug: 'seo-visibilite',
    serviceSlug: 'seo-aio',
    body: `On juge un site en une fraction de seconde. Avant même de lire un mot, le visiteur ressent si « ça répond » ou si « ça rame ». Cette première impression a un coût — ou un bénéfice — très concret, mesurable en conversions.

## Chaque dixième de seconde compte

Les chiffres des grandes études convergent :

- **Deloitte** (étude « Milliseconds Make Millions », 2020) a analysé les données mobiles de dizaines de marques en Europe et aux États-Unis : **réduire le temps de chargement de seulement 0,1 seconde augmentait le taux de conversion de 8 %** sur les sites de e-commerce, et de 10 % sur les sites de voyage.
- **Portent** (2022) a observé que **le taux de conversion chute d'environ 4,4 % par seconde supplémentaire** de chargement sur les cinq premières secondes. Un site qui s'affiche en 1 seconde convertit jusqu'à **2,5 fois mieux** qu'un site qui met 5 secondes.
- **Google** rappelle de son côté que **53 % des visites mobiles sont abandonnées** si une page met plus de 3 secondes à charger.

Traduit en clair : sur 100 visiteurs gagnés à grand-peine (référencement, publicité, réseaux), une bonne partie repart avant même d'avoir vu votre offre, simplement parce que la page tarde.

## Pourquoi la lenteur coûte si cher

Trois effets se cumulent :

- **L'impatience mobile.** L'essentiel du trafic est désormais sur smartphone, souvent en réseau imparfait. La tolérance à l'attente y est minimale.
- **La concurrence est à un clic.** Si votre page traîne, le visiteur revient aux résultats de recherche et clique sur le suivant.
- **L'effet sur la confiance.** Un site lent est perçu comme moins fiable, moins professionnel — un signal négatif avant même le premier échange.

## La vitesse compte aussi pour Google

Depuis l'arrivée des **Core Web Vitals**, Google intègre officiellement l'expérience de chargement (rapidité d'affichage, stabilité visuelle, réactivité) parmi ses signaux de classement. Un site rapide n'est donc pas seulement plus convaincant pour l'humain : il est aussi mieux placé pour être trouvé. La lenteur, c'est une double peine — moins de visites, et moins de conversions parmi celles qui restent.

## Comment accélérer, concrètement

La bonne nouvelle : l'essentiel des gains vient de quelques leviers connus.

- **Optimiser les images** (formats modernes, compression, bonnes dimensions) — souvent le premier coupable.
- **Un hébergement et un cache à la hauteur**, proches de vos visiteurs.
- **Alléger le code** et limiter les scripts tiers (trackers, widgets) qui s'empilent.
- **Mesurer** régulièrement avec des outils gratuits (PageSpeed Insights, Lighthouse) plutôt qu'« au ressenti ».

Un site bien construit dès le départ — code propre, technologies sobres — évite la plupart de ces problèmes. Quand la lenteur est déjà installée, un diagnostic permet d'identifier les deux ou trois corrections qui apporteront l'essentiel du gain.

**Sources :** Deloitte — « Milliseconds Make Millions » (2020) ; Portent — Site Speed & Conversion (2022) ; Think with Google (comportement mobile).`,
  },
  {
    slug: 'seo-ou-publicite-ou-investir',
    title: 'SEO ou publicité : où investir quand on démarre ?',
    description:
      'La publicité achète une visibilité immédiate mais qui s’arrête avec le budget ; le SEO se construit mais devient un actif durable. Comment arbitrer, chiffres à l’appui.',
    categorySlug: 'seo-visibilite',
    serviceSlug: 'seo-aio',
    body: `« On lance des pubs ou on fait du référencement ? » C'est l'une des premières questions quand on veut être visible en ligne. Les deux fonctionnent — mais pas de la même façon, ni sur le même horizon de temps.

## La publicité : rapide, mais locative

La publicité en ligne (Google Ads, réseaux sociaux) a un avantage imbattable : **l'immédiateté**. Vous payez, vous apparaissez, vous pouvez générer des contacts dès le premier jour. C'est idéal pour tester une offre, pousser un événement ou compléter une visibilité encore faible.

Son revers : **la visibilité s'arrête net quand le budget s'arrête.** La publicité, c'est de la location d'attention. Tant que vous payez, vous êtes là ; le jour où vous coupez, vous disparaissez. Et plus la concurrence enchérit, plus le coût par clic grimpe.

## Le SEO : lent à construire, mais capitalisable

Le référencement naturel (SEO) prend le chemin inverse : il demande du temps et de la régularité avant de produire ses effets, mais ce qu'il bâtit **reste**. Une page bien positionnée continue d'attirer des visiteurs sans payer à chaque clic.

Et la visibilité naturelle est très concentrée sur les premières positions. D'après l'analyse de **Backlinko** portant sur 4 millions de résultats de recherche Google, **le premier résultat naturel capte à lui seul environ 27,6 % des clics** ; le deuxième environ 18,7 %, le troisième 10,2 %. Autrement dit, gagner quelques positions sur une requête qui compte change radicalement le volume de visites — et ce trafic-là ne se facture pas au clic.

## Le piège du « tout publicité »

Beaucoup de TPE et PME démarrent (logiquement) par la publicité pour son effet immédiat… puis n'en sortent jamais. Résultat : un budget qui tourne en boucle sans jamais construire d'actif. Le jour où il faut réduire la voilure, la visibilité s'effondre.

## Notre conseil : un dosage selon votre maturité

Il n'y a pas de réponse unique, mais une logique simple :

- **Au lancement**, la publicité aide à amorcer : premiers contacts, premiers apprentissages sur ce qui convertit.
- **En parallèle**, on investit dans le SEO et le contenu pour bâtir une visibilité qui, à terme, réduit la dépendance à la publicité.
- **À mesure que le SEO monte**, on rééquilibre : la publicité devient un accélérateur ponctuel, plus la seule source de trafic.

L'objectif n'est pas de choisir un camp, mais de **ne pas rester captif** d'un budget publicitaire permanent. La publicité fait décoller ; le référencement fait durer.

Le bon point de départ : savoir où vous en êtes (positions actuelles, mots-clés à portée, état technique du site) pour décider en connaissance de cause, plutôt qu'au feeling.

**Sources :** Backlinko — analyse de 4 millions de résultats Google (taux de clic par position).`,
  },

  // ───────────────────────── Lot 2 — Web & Expérience ─────────────────────────
  {
    slug: 'premiere-impression-site-50-millisecondes',
    title: 'Vous avez 50 millisecondes pour convaincre',
    description:
      'Un visiteur juge votre site avant même de l’avoir lu. Ce que dit la recherche sur la première impression, et comment soigner ces premiers instants.',
    categorySlug: 'sites-web-ux',
    serviceSlug: 'sites-vitrines',
    body: `Avant de lire un mot, le visiteur a déjà jugé. C'est instantané, presque inconscient — et ça pèse lourd sur la suite : rester ou repartir, faire confiance ou douter.

## 50 millisecondes : le verdict tombe

Une étude de référence de Lindgaard et de ses collègues (2006, revue *Behaviour & Information Technology*) a montré que **les internautes se forment une opinion sur l'attractivité d'une page web en environ 50 millisecondes** — soit un vingtième de seconde. Plus frappant encore : ce jugement quasi instantané reste très cohérent avec celui formé après une exposition plus longue. La première impression ne se rattrape donc pas vraiment ; elle s'impose d'emblée.

## Ce que cela change pour vous

Dans ce laps de temps, personne ne lit vos arguments. Ce qui agit, c'est l'**impression visuelle d'ensemble** : un site clair, soigné et cohérent inspire confiance ; un site daté, chargé ou brouillon installe le doute — sur le sérieux de l'entreprise elle-même. Pour une TPE ou une PME qui se fait connaître en ligne, c'est souvent là que se joue le premier filtre.

## Ce qui se joue dans ces premiers instants

- **La clarté.** Une hiérarchie visible, de l'espace, une proposition de valeur compréhensible en un coup d'œil.
- **La cohérence.** Couleurs, typographies et style alignés : le cerveau associe cohérence et fiabilité.
- **La rapidité.** Une page qui tarde gâche la première impression avant même qu'elle se forme.
- **La sobriété.** Trop d'éléments, de pop-ups ou d'animations brouillent le message.

## Soigner l'essentiel

Pas besoin d'en faire trop — au contraire. Une zone visible dès l'arrivée (sans avoir à scroller) qui dit *qui vous êtes, ce que vous proposez et ce qu'on peut faire ensuite* ; un design épuré et cohérent ; des visuels de qualité ; et une vraie attention portée à la lisibilité. C'est souvent plus efficace qu'un site « riche » mais confus.

La bonne question n'est pas « est-ce que mon site me plaît ? », mais « qu'est-ce qu'un visiteur comprend, et ressent, dans la première seconde ? ». Un regard extérieur — un audit UX rapide — répond justement à cette question, sans complaisance.

**Sources :** Lindgaard, Fernandes, Dudek & Brown (2006), *Attention web designers: You have 50 milliseconds to make a good first impression!*, Behaviour & Information Technology.`,
  },
  {
    slug: 'site-pense-mobile-first',
    title: 'Votre site doit être pensé pour le mobile (Google l’exige déjà)',
    description:
      'Près de 6 visites sur 10 viennent du mobile, et Google indexe en priorité la version mobile. Pourquoi le « mobile d’abord » n’est plus négociable.',
    categorySlug: 'sites-web-ux',
    serviceSlug: 'sites-vitrines',
    body: `Pendant longtemps, on concevait un site « pour ordinateur » puis on l'adaptait, tant bien que mal, au téléphone. Aujourd'hui, c'est l'inverse qu'il faut faire — et ce n'est pas une question de mode.

## Le mobile est devenu la norme

D'après les données de **Statcounter**, le mobile représente désormais **autour de 60 % du trafic web mondial** (avec un pic à 61 % en 2024). Pour beaucoup d'activités locales ou grand public, la proportion de visiteurs sur smartphone est encore plus élevée. Concevoir d'abord pour un grand écran, c'est donc optimiser pour une minorité.

## Google indexe le mobile en priorité

Le signal le plus clair vient de Google lui-même : **depuis le 5 juillet 2024, la bascule vers le « mobile-first indexing » est totalement achevée**. Concrètement, c'est la **version mobile de votre site qui sert de référence** pour l'indexation et le classement. Un site mal fichu sur téléphone n'est donc plus seulement désagréable à utiliser : il est pénalisé là où il cherche à être trouvé.

## Les conséquences concrètes

- **Un visiteur sur mobile mal servi repart vite** — et c'est la majorité de votre audience.
- **Un site non adapté plombe votre référencement**, puisque Google évalue d'abord la version mobile.
- **Les conversions chutent** : un formulaire pénible à remplir au pouce, des boutons trop petits, un texte illisible… autant de contacts perdus.

## Bien faire, sans sur-ingénierie

- **Responsive par conception** : une mise en page qui s'adapte vraiment, pensée petit écran d'abord.
- **Performance mobile** : images optimisées, chargement rapide même en 4G.
- **Ergonomie tactile** : boutons généreux, formulaires courts, navigation simple au pouce.
- **Lisibilité** : tailles de texte confortables, contrastes suffisants.

Le bon réflexe : tester votre site sur votre propre téléphone, comme le ferait un client pressé. Si quelque chose vous agace, ça les fera fuir. Un diagnostic mobile met le doigt sur les blocages prioritaires.

**Sources :** Statcounter (part du trafic web mobile, 2024) ; Google Search Central (passage complet au mobile-first indexing, juillet 2024).`,
  },
  {
    slug: 'accessibilite-web-obligation-opportunite',
    title: 'Accessibilité web : une obligation légale, et une bonne idée',
    description:
      'Depuis juin 2025, l’European Accessibility Act impose l’accessibilité à de nombreux services en ligne. Tour d’horizon clair des enjeux et des bases.',
    categorySlug: 'sites-web-ux',
    serviceSlug: 'sites-institutionnels',
    body: `L'accessibilité numérique, longtemps perçue comme une « option pour quelques-uns », est devenue à la fois une obligation et un standard de qualité. Et depuis 2025, le cadre s'est durci.

## Une obligation européenne désormais en vigueur

L'**European Accessibility Act** (directive UE 2019/882) est **applicable depuis le 28 juin 2025**, via les lois nationales de transposition. Nouveauté majeure : il ne vise plus seulement le secteur public, mais aussi de nombreux **services privés** — e-commerce, banque, transport, télécommunications… La norme de référence est le **WCAG 2.1 niveau AA** (via la norme harmonisée EN 301 549). Autrement dit, l'accessibilité n'est plus un « plus » : pour beaucoup d'acteurs, c'est une exigence.

## Pourquoi cela concerne tout le monde

Selon l'Organisation mondiale de la santé, **environ 1,3 milliard de personnes — près de 16 % de la population mondiale — vivent avec un handicap significatif**. S'y ajoutent les limitations temporaires (un bras cassé) ou situationnelles (plein soleil, environnement bruyant, connexion lente). Un site inaccessible, c'est une partie de vos visiteurs — et de vos clients — qu'on laisse de côté.

## L'accessibilité profite à tous

Bonne nouvelle : ce qui rend un site accessible le rend meilleur pour **tout le monde**. Des contrastes suffisants, une structure claire, des textes alternatifs, une navigation au clavier : autant d'améliorations qui bénéficient aussi au référencement, à la lisibilité mobile et aux utilisateurs âgés. L'accessibilité et la qualité d'un site vont de pair.

## Par où commencer

- **Contrastes et tailles de texte** suffisants pour être lus facilement.
- **Navigation au clavier** possible partout (sans souris).
- **Textes alternatifs** sur les images porteuses de sens.
- **Structure sémantique** claire (titres, listes, libellés de formulaires).
- **Sous-titres** et transcriptions pour les contenus audio/vidéo.

Inutile de tout révolutionner d'un coup : un audit d'accessibilité priorise les corrections qui comptent vraiment, en fonction de votre activité et de vos obligations.

**Sources :** European Accessibility Act — directive (UE) 2019/882 (entrée en application : 28 juin 2025) ; normes WCAG 2.1 / EN 301 549 ; Organisation mondiale de la santé (données sur le handicap).`,
  },

  // ───────────────────────── Lot 3 — Marque & Contenu ─────────────────────────
  {
    slug: 'coherence-marque-revenus',
    title: 'La cohérence de votre marque peut valoir jusqu’à 33 % de revenus en plus',
    description:
      'Présenter sa marque de façon cohérente sur tous les canaux n’est pas qu’une question d’esthétique : c’est un levier de revenus mesuré.',
    categorySlug: 'branding-et-idendite',
    serviceSlug: 'branding-identite',
    body: `« Faire attention à sa marque », pour beaucoup de petites structures, ça sonne comme un luxe de grandes entreprises. Les chiffres racontent autre chose : la cohérence de marque a un effet mesurable sur le chiffre d'affaires.

## Un effet chiffré, pas une intuition

L'étude de référence de **Lucidpress** sur l'impact de la cohérence de marque (largement relayée, notamment par PR Newswire en 2019) conclut qu'une **présentation cohérente de la marque sur tous les canaux peut augmenter les revenus de 10 à 33 %**. La borne haute — un tiers de revenus en plus — illustre l'enjeu : ce n'est pas un détail cosmétique, c'est un facteur de performance.

## Pourquoi la cohérence paie

- **La reconnaissance.** Voir les mêmes codes (logo, couleurs, ton) d'un support à l'autre ancre la marque dans la mémoire. On fait plus facilement confiance à ce qu'on reconnaît.
- **La réduction de la friction.** Quand votre site, vos devis, vos réseaux et vos emails « se ressemblent », le client n'a pas à se redemander s'il est au bon endroit. La cohérence rassure.
- **La perception de sérieux.** Une marque cohérente paraît plus établie, plus professionnelle — à offre égale, ça pèse.

## Cohérence ne veut pas dire rigidité

Être cohérent, ce n'est pas tout figer ni se répéter. C'est disposer de **repères clairs** — une charte vivante — qu'on décline avec souplesse selon les supports. L'objectif : qu'on vous reconnaisse, pas qu'on s'ennuie.

## Concrètement, par où commencer

- **Poser les fondamentaux** : logo, palette de couleurs, typographies, et surtout un **ton de voix** défini.
- **Créer quelques modèles** réutilisables (devis, présentation, publications) pour appliquer la charte sans effort.
- **Vérifier l'existant** : votre site, vos profils, vos documents parlent-ils d'une même voix ?

Une identité claire, c'est ce qui transforme une série de supports épars en une **marque** qu'on reconnaît et en qui on a confiance. Le bon point de départ est souvent un état des lieux de votre image actuelle.

**Sources :** Lucidpress — *The Impact of Brand Consistency* (relayé par PR Newswire, 2019).`,
  },
  {
    slug: 'credibilite-image-en-ligne-design',
    title: 'Sur le web, votre crédibilité se joue d’abord sur l’image',
    description:
      'Avant de juger votre offre, on juge votre apparence. Ce que montre la recherche sur le lien entre design et confiance.',
    categorySlug: 'branding-et-idendite',
    serviceSlug: 'branding-identite',
    body: `On aimerait croire qu'on est jugé sur le fond : la qualité de l'offre, le sérieux du travail. En ligne, la réalité est plus brutale — le premier jugement passe par l'apparence.

## Le design, premier signal de confiance

Le **Stanford Web Credibility Project** (B.J. Fogg et ses collègues, 2002), une référence du domaine, a montré que **75 % des internautes jugent la crédibilité d'une entreprise à partir du design de son site**. Mieux : interrogés sur ce qui fonde leur jugement, **46,1 % citent en premier l'aspect visuel** (mise en page, typographie, cohérence, images) — bien avant le contenu lui-même.

Autrement dit : un site soigné ne fait pas que « bien paraître ». Il agit comme une preuve indirecte de sérieux — et un site négligé sème le doute, quelle que soit la qualité réelle derrière.

## Pourquoi ce raccourci est… logique

Le visiteur ne peut pas, en quelques secondes, vérifier votre expertise. Alors il se fie à ce qu'il peut évaluer immédiatement : est-ce soigné ? cohérent ? à jour ? Un visuel maîtrisé suggère une entreprise qui prend soin des détails — donc, probablement, de ses clients.

## Les marqueurs de crédibilité

- **Une identité visuelle cohérente** (couleurs, typo, style) d'une page à l'autre.
- **Des visuels de qualité** plutôt que des images génériques mal intégrées.
- **Des preuves** : avis, témoignages, références, logos clients réels.
- **De la clarté** : on comprend vite qui vous êtes et ce que vous proposez.
- **Des informations de contact visibles** : une entreprise joignable inspire confiance.

## Soigner son image, c'est soigner sa crédibilité

Investir dans une identité claire et un site soigné n'est pas une dépense « de confort » : c'est lever, dès les premières secondes, le doute qui ferait fuir un prospect. Pour savoir où vous en êtes, rien ne vaut un regard extérieur honnête sur l'image que renvoie votre présence en ligne.

**Sources :** Stanford Web Credibility Project — Fogg et al. (2002), Stanford Persuasive Technology Lab.`,
  },
  {
    slug: 'content-marketing-atout-rentable',
    title: 'Le contenu : l’atout le plus rentable de votre marque',
    description:
      'Bien fait, le contenu coûte moins cher que la publicité et génère plus de contacts. Pourquoi en faire un pilier de votre visibilité.',
    categorySlug: 'branding-et-idendite',
    serviceSlug: 'strategie-copywriting',
    body: `Publier des articles, des guides, des réponses utiles : beaucoup de dirigeants voient ça comme « du temps en plus qu'on n'a pas ». Pourtant, sur la durée, le contenu est souvent le canal le plus rentable.

## Trois fois plus de contacts, pour bien moins cher

Selon **DemandMetric**, le *content marketing* **coûte environ 62 % de moins que le marketing traditionnel** et **génère à peu près trois fois plus de leads** (contacts qualifiés). La raison est simple : un bon contenu continue d'attirer et de convaincre longtemps après sa publication, là où une publicité s'arrête avec le budget.

## Pourquoi ça fonctionne

- **C'est un actif durable.** Un article qui répond à une vraie question peut générer des visites et des contacts pendant des années.
- **Ça nourrit le référencement.** Plus vous répondez aux questions de vos clients, plus vous avez de chances d'être trouvé sur Google.
- **Ça installe l'expertise et la confiance.** En aidant avant de vendre, vous démontrez votre valeur plutôt que de l'affirmer.

## Le contenu utile plutôt que promotionnel

L'erreur classique : ne parler que de soi. Le contenu qui marche part des **questions réelles de vos clients** — « combien ça coûte ? », « comment choisir ? », « est-ce que ça vaut le coup ? » — et y répond honnêtement. La vente vient ensuite, naturellement, parce que vous avez été utile.

## Par où commencer, sans y passer ses nuits

- **Listez les 10 questions** que vos clients vous posent le plus souvent : ce sont vos 10 premiers sujets.
- **Visez la régularité** plutôt que le volume : un bon article par mois vaut mieux que dix bâclés.
- **Réutilisez** : un article peut devenir plusieurs publications réseaux, une section de page service, un argument commercial.

Le contenu, ce n'est pas « écrire pour écrire » : c'est transformer votre expertise en visibilité et en confiance. Une stratégie éditoriale simple, alignée sur vos services, suffit à enclencher le mouvement.

**Sources :** DemandMetric — comparaison content marketing vs marketing traditionnel (coût et génération de leads).`,
  },

  // ───────────────────────── Lot 4 — Digitalisation & Process ─────────────────────────
  {
    slug: 'competences-numeriques-enjeu-formation',
    title: '44 % des Européens n’ont pas les compétences numériques de base',
    description:
      'Monter en compétence n’est pas un luxe : c’est la condition pour tirer vraiment parti de ses outils. État des lieux et leviers concrets.',
    categorySlug: 'formation',
    serviceSlug: 'formation',
    body: `On parle beaucoup d'outils, d'IA, d'automatisation. On parle moins de la condition qui rend tout cela utile : savoir s'en servir. Et sur ce point, l'écart reste large.

## Un fossé numérique persistant

Selon **Eurostat**, en 2023, **seuls 56 % des Européens de 16 à 74 ans possédaient au moins des compétences numériques de base** — autrement dit, **44 % ne les avaient pas**. L'Union européenne s'est fixé comme objectif d'atteindre **80 % d'ici 2030** : le chemin est encore long, et il concerne directement les TPE/PME, leurs dirigeants comme leurs équipes.

## Le coût (invisible) de l'écart

Un manque de compétences ne se voit pas sur une facture, mais il se paie : des **outils sous-exploités** (on utilise 10 % d'un logiciel payé plein pot), une **dépendance permanente** à un prestataire pour la moindre modification, des **erreurs** et du temps perdu, et au final une transformation numérique qui patine.

## La formation, un investissement (pas une dépense)

Former une équipe, c'est transformer un coût d'outil en **autonomie réelle**. Plutôt que de subir la technologie, vos collaborateurs la pilotent : ils modifient le site, gèrent leurs données, exploitent leurs tableaux de bord — sans dépendre de personne pour le quotidien.

## Concrètement, une formation utile, c'est…

- **Sur VOS outils**, pas en théorie : WordPress, votre CRM, vos tableurs, vos outils de gestion.
- **Pratique et progressive** : on apprend en faisant, sur des cas réels.
- **Documentée** : des tutoriels et fiches pour ne pas tout réapprendre dans six mois.
- **Orientée autonomie** : l'objectif n'est pas de vous fidéliser, mais de vous rendre libres.

La vraie question n'est pas « faut-il un nouvel outil ? », mais « mon équipe est-elle à l'aise avec ceux qu'elle a déjà ? ». Y répondre honnêtement, c'est souvent le meilleur point de départ.

**Sources :** Eurostat — compétences numériques dans l'UE (2023) ; objectif « Décennie numérique » de l'UE (80 % d'ici 2030).`,
  },
  {
    slug: 'outils-sous-exploites-adoption-formation',
    title: 'Acheter un outil ne suffit pas : la moitié des licences dorment',
    description:
      'On investit dans des logiciels… qu’on n’utilise qu’à moitié. Pourquoi l’adoption et la formation comptent plus que l’achat.',
    categorySlug: 'formation',
    serviceSlug: 'formation',
    body: `Le réflexe est tentant : un problème d'organisation ? On achète un outil. Six mois plus tard, l'outil est là… mais le problème aussi. Parce que le sujet n'était pas l'achat, mais l'usage.

## Un gâchis silencieux

Les études sur la gestion des logiciels sont éloquentes. D'après le **State of ITAM 2024 de Flexera**, **plus de la moitié des licences SaaS sont sous-utilisées ou inutilisées** dans les organisations. Le **2024 SaaS Management Index de Zylo** chiffre même à environ **18 millions de dollars** le gaspillage annuel moyen lié aux licences inutilisées dans les grandes entreprises. À l'échelle d'une PME, les montants sont plus petits — mais la logique est la même : on paie pour des outils qu'on n'exploite pas.

## Le vrai problème n'est pas l'outil

Un logiciel n'apporte de valeur que s'il est **adopté** : compris, intégré aux habitudes, utilisé pour ce qu'il sait faire de mieux. Or l'adoption ne va pas de soi. Sans accompagnement, chacun continue ses anciennes méthodes en parallèle — et l'outil devient une dépense de plus, pas un gain.

## Bien équiper n'est pas bien utiliser

- **Trop d'outils tue l'outil.** Empiler les solutions qui se recouvrent crée de la confusion, pas de l'efficacité.
- **Un outil mal paramétré** dessert plus qu'il n'aide.
- **Un outil non formé** est vite contourné.

## Ce qui fait la différence

- **Choisir des outils adaptés** à votre taille et à vos besoins réels — souvent, des solutions sobres ou open source suffisent.
- **Former et accompagner** : c'est l'adoption, pas l'achat, qui crée la valeur.
- **Documenter** les usages pour ancrer les bonnes pratiques.
- **Mesurer** : qui utilise quoi, et est-ce que ça aide vraiment ?

Avant d'ajouter un énième logiciel, il vaut souvent mieux **mieux exploiter l'existant**. Un état des lieux de vos outils — ce que vous payez, ce que vous utilisez vraiment — révèle presque toujours des marges de progrès immédiates.

**Sources :** Flexera — State of ITAM 2024 ; Zylo — 2024 SaaS Management Index.`,
  },
  {
    slug: 'automatiser-taches-repetitives-temps',
    title: 'Automatiser les tâches répétitives : du temps (et de la sérénité) regagnés',
    description:
      'Saisies en double, copier-coller, exports manuels… Les chiffres sur le temps perdu, et comment le récupérer intelligemment.',
    categorySlug: 'formation',
    serviceSlug: 'automatisation-n8n',
    body: `Ressaisir une commande d'un outil à l'autre, recopier des coordonnées, exporter puis réimporter un tableau… Ces micro-tâches semblent anodines. Mises bout à bout, elles dévorent un temps considérable — et l'énergie qui va avec.

## Beaucoup de temps part en fumée

Selon une enquête **Smartsheet**, **plus de 40 % des employés consacrent au moins un quart de leur semaine à des tâches manuelles et répétitives** (saisie de données, collecte d'informations, e-mails). Toujours selon Smartsheet, **près de 60 % des personnes interrogées estiment pouvoir gagner six heures ou plus par semaine** — presque une journée entière — si la partie répétitive de leur travail était automatisée.

À cela s'ajoute un coût caché : la **saisie manuelle introduit des erreurs** (les estimations situent généralement le taux d'erreur humaine entre 1 et 5 %), avec les corrections et les litiges que cela entraîne.

## La double saisie, ennemie discrète

Le cas le plus courant chez les TPE/PME : les mêmes données ressaisies dans plusieurs outils (site, CRM, facturation, tableur). C'est du temps perdu **et** une source d'incohérences — un client mis à jour ici mais pas là.

## Automatiser, mais bien

- **Commencer petit** : identifier 2 ou 3 tâches répétitives à fort volume, et les automatiser d'abord.
- **Clarifier le processus avant de l'outiller** : automatiser un mauvais processus ne fait que l'accélérer.
- **Privilégier des outils ouverts et auto-hébergeables** (comme n8n) pour connecter vos applications sans vous rendre captif d'un nouvel abonnement.
- **Garder l'humain dans la boucle** : l'automatisation traite le répétitif, vos équipes se concentrent sur ce qui a de la valeur.

## L'enjeu réel : monter en compétence

Automatiser n'est pas « remplacer » : c'est libérer du temps et **former les équipes** à piloter leurs propres flux. C'est là que le gain devient durable — et que l'autonomie s'installe.

Le bon point de départ : cartographier vos tâches répétitives et repérer celles qui méritent d'être automatisées en premier.

**Sources :** enquête Smartsheet sur le temps consacré aux tâches manuelles et répétitives (temps passé et gain potentiel via l'automatisation).`,
  },
]

async function ensureSubCategory(payload: any, c: SubCat, catIdBySlug: Record<string, any>) {
  const parent = await payload.find({
    collection: 'categories',
    where: { slug: { equals: c.parentSlug } },
    limit: 1,
    pagination: false,
  })
  const parentId = parent.docs[0]?.id
  const data: any = { title: c.title, slug: c.slug, parent: parentId ?? null }
  const existing = await payload.find({
    collection: 'categories',
    where: { slug: { equals: c.slug } },
    limit: 1,
    pagination: false,
  })
  catIdBySlug[c.slug] = existing.docs[0]
    ? (await payload.update({ collection: 'categories', id: existing.docs[0].id, data })).id
    : (await payload.create({ collection: 'categories', data })).id
}

export async function seedBlogArticles(payload: any) {
  const catIdBySlug: Record<string, any> = {}

  // 1) Sous-catégories à créer si absentes
  for (const c of subCategories) await ensureSubCategory(payload, c, catIdBySlug)

  // 2) Résoudre les autres catégories utilisées (existantes : branding, formation…)
  const referenced = Array.from(new Set(articles.map((a) => a.categorySlug)))
  const missingCats: string[] = []
  for (const slug of referenced) {
    if (catIdBySlug[slug]) continue
    const found = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
    })
    if (found.docs[0]) catIdBySlug[slug] = found.docs[0].id
    else missingCats.push(slug)
  }

  // 3) Articles (publiés)
  const idsByService: Record<string, any[]> = {}
  const created: string[] = []
  const errors: string[] = []
  for (const a of articles) {
    try {
      const catId = catIdBySlug[a.categorySlug]
      const data: any = {
        title: a.title,
        slug: a.slug,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        content: toLexical(a.body),
        meta: { title: a.title, description: a.description },
        categories: catId ? [catId] : [],
      }
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: a.slug } },
        limit: 1,
        pagination: false,
      })
      const id = existing.docs[0]
        ? (await payload.update({ collection: 'posts', id: existing.docs[0].id, data })).id
        : (await payload.create({ collection: 'posts', data })).id
      created.push(a.slug)
      if (a.serviceSlug) (idsByService[a.serviceSlug] ||= []).push(id)
    } catch (err) {
      errors.push(`${a.slug}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 4) Rattacher chaque article à son service (related_articles) → CTA contextuel, sans écraser
  for (const [slug, ids] of Object.entries(idsByService)) {
    const svc = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      depth: 0,
    })
    if (svc.docs[0]) {
      const current = (svc.docs[0].related_articles || []).map((r: any) =>
        r && typeof r === 'object' ? r.id : r,
      )
      const merged = Array.from(new Set([...current, ...ids]))
      await payload.update({
        collection: 'services',
        id: svc.docs[0].id,
        data: { related_articles: merged },
      })
    }
  }

  return { ok: true, articles: created.length, created, missingCats, errors }
}
