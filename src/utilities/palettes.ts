// Registre des palettes de couleurs du site — source de vérité UNIQUE, partagée par :
//   - le champ « Apparence » des Paramètres du site (options du select) ;
//   - le composant d'aperçu visuel de l'admin (pastilles) ;
//   - le layout frontend (validation de l'attribut data-palette).
// Les couleurs elles-mêmes vivent dans globals.css (blocs [data-palette='…']) ;
// les pastilles ci-dessous n'en sont qu'un résumé pour l'aperçu admin.

export type PaletteDefinition = {
  value: string
  label: string
  description: string
  /** Pastilles d'aperçu (mode clair) : [fond, marque, accent, texte] */
  swatches: [string, string, string, string]
}

export const DEFAULT_PALETTE = 'navy-terracotta'

export const PALETTES: PaletteDefinition[] = [
  {
    value: 'navy-terracotta',
    label: 'Navy & Terracotta (actuelle)',
    description: 'L’identité NRJKA d’origine — bleu nuit et terracotta.',
    swatches: ['#ffffff', '#1f2a44', '#f4a261', '#1a1f2e'],
  },
  {
    value: 'foret-cuivre',
    label: 'Forêt & Cuivre',
    description: 'Vert sapin profond et cuivre chaud — premium, naturel.',
    swatches: ['#f7f7f3', '#1a3329', '#c87f4a', '#16211b'],
  },
  {
    value: 'ocean-corail',
    label: 'Océan & Corail',
    description: 'Bleu pétrole et corail doux — frais, moderne.',
    swatches: ['#f5f8f8', '#0f3a4a', '#ef8354', '#122430'],
  },
  {
    value: 'aubergine-or',
    label: 'Aubergine & Or',
    description: 'Prune profond et or sable — luxueux, différenciant.',
    swatches: ['#faf7f4', '#3b2144', '#d9a441', '#251a29'],
  },
  {
    value: 'graphite-menthe',
    label: 'Graphite & Menthe',
    description: 'Anthracite bleuté et vert menthe — tech, sobre.',
    swatches: ['#f6f7f8', '#23272f', '#5cc8a1', '#1a1d23'],
  },
  {
    value: 'premium-tech',
    label: 'Premium Tech',
    description: 'Crème, sapin sombre et lime électrique.',
    swatches: ['#f7f4ef', '#143d3c', '#d6ff3f', '#121417'],
  },
  {
    value: 'studio-creatif',
    label: 'Studio Créatif',
    description: 'Ivoire, bleu électrique et corail vif.',
    swatches: ['#faf7f2', '#3b2eff', '#ff6b4a', '#171717'],
  },
  {
    value: 'editorial-moderne',
    label: 'Éditorial Moderne',
    description: 'Papier, encre bleue et rouge brique.',
    swatches: ['#f5f1ea', '#222e50', '#e94f37', '#1d1b18'],
  },
  {
    value: 'human-warm',
    label: 'Human & Warm',
    description: 'Ivoire chaud, terre cuite et jaune miel.',
    swatches: ['#fff8ef', '#7a3e2c', '#ffb000', '#211a16'],
  },
  {
    value: 'luxury-digital',
    label: 'Luxury Digital',
    description: 'Lin, vert bouteille et or vieilli.',
    swatches: ['#f4efe7', '#243b35', '#c89b3c', '#15110d'],
  },
  {
    value: 'bold-future',
    label: 'Bold Future',
    description: 'Nuit violette, lavande et lime — pensée pour le mode sombre.',
    swatches: ['#101014', '#b8a6ff', '#ccff00', '#f6f2ff'],
  },
  // ── Vague 2 — tendances 2025-2026 & références du web ──
  {
    value: 'indigo-saas',
    label: 'Indigo SaaS',
    description: 'Blanc bleuté, marine profond et blurple — l’élégance fintech (réf. Stripe).',
    swatches: ['#f7f9fc', '#0a2540', '#635bff', '#0a2540'],
  },
  {
    value: 'noir-studio',
    label: 'Noir Studio',
    description: 'Monochrome premium et bleu électrique — minimalisme radical (réf. Vercel).',
    swatches: ['#fafafa', '#0a0a0a', '#0070f3', '#0a0a0a'],
  },
  {
    value: 'nebuleuse',
    label: 'Nébuleuse',
    description: 'Neutres zinc et violet retenu — sobriété produit (réf. Linear).',
    swatches: ['#f7f7f9', '#5e6ad2', '#97a0ff', '#1c1d23'],
  },
  {
    value: 'teal-transformatif',
    label: 'Teal Transformatif',
    description: 'Blanc nuage et teal profond — LA couleur 2026 (WGSN/Coloro).',
    swatches: ['#f7fafa', '#0f4c48', '#14b8a6', '#0e2a28'],
  },
  {
    value: 'sauge-lin',
    label: 'Sauge & Lin',
    description: 'Neutres chauds, sauge et sienne douce — le warm minimal 2025.',
    swatches: ['#f5f0eb', '#3f5346', '#c98a72', '#232019'],
  },
  {
    value: 'retro-sunset',
    label: 'Rétro Sunset',
    description: 'Crème 70s, sienne brûlée et tournesol — la vague vintage.',
    swatches: ['#faf3e7', '#8a3b23', '#f2b530', '#2b1a12'],
  },
  {
    value: 'magenta-pulse',
    label: 'Magenta Pulse',
    description: 'Prune profonde et magenta vif — l’esthétique dopamine.',
    swatches: ['#fdf7fb', '#58185c', '#d61f8d', '#27101f'],
  },
  {
    value: 'halo-iridescent',
    label: 'Halo Iridescent',
    description: 'Violet-bleu profond et cyan glacé — l’esthétique IA/metallic.',
    swatches: ['#f6f6fb', '#2e2a72', '#4cc9f0', '#171733'],
  },
  {
    value: 'vert-commerce',
    label: 'Vert Commerce',
    description: 'Vert bouteille et vert vif — confiance e-commerce (réf. Shopify).',
    swatches: ['#f8faf8', '#004c3f', '#17b877', '#122b21'],
  },
  {
    value: 'corail-voyage',
    label: 'Corail Voyage',
    description: 'Charbon chaud et corail signature — chaleureux, humain (réf. Airbnb).',
    swatches: ['#fffaf8', '#2b2624', '#ff385c', '#262220'],
  },
  // ── Saisonnières ──
  {
    value: 'noel',
    label: '🎄 Noël',
    description: 'Neige chaude, vert sapin et rouge baie — festif sans kitsch.',
    swatches: ['#f9f7f2', '#14432f', '#d43f4e', '#16251c'],
  },
  {
    value: 'vacances',
    label: '🏖️ Vacances',
    description: 'Sable clair, bleu océan et soleil mangue — l’été au bureau.',
    swatches: ['#fdf9f0', '#0e6ba8', '#ffb703', '#17313d'],
  },
  {
    value: 'saint-valentin',
    label: '💝 Saint-Valentin',
    description: 'Rose poudré, bordeaux framboise et rose vif — tendre mais premium.',
    swatches: ['#fdf5f7', '#7a1f3d', '#ec5c8c', '#331420'],
  },
  {
    value: 'nouvel-an',
    label: '🥂 Nouvel An',
    description: 'Champagne, bleu minuit et or — l’élégance du réveillon.',
    swatches: ['#f7f5f0', '#131b3a', '#d4af37', '#171d33'],
  },
]

const PALETTE_VALUES = new Set(PALETTES.map((p) => p.value))

/** Valide une valeur venant de la base ; repli sur la palette par défaut. */
export function resolvePalette(value: unknown): string {
  return typeof value === 'string' && PALETTE_VALUES.has(value) ? value : DEFAULT_PALETTE
}
