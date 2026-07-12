/* eslint-disable @typescript-eslint/no-explicit-any */
// Tâche #13 — Slugs EN traduits (non destructif).
// Après la localisation des slugs (backfill EN=FR), ce script donne aux pages/contenus
// leur « vrai » slug anglais :
//   - Pages structurelles → table de correspondance explicite (a-propos→about, …) ;
//   - Pages restantes / Articles → slug généré depuis le TITRE EN (s'il est traduit) ;
//   - Pôles (Expertises) → titre non localisé → table de correspondance statique
//     (traduction manuelle assumée — plus aucune dépendance à LibreTranslate) ;
//   - Réalisations (CaseStudies) → slug = nom du client (nom propre, neutre) → conservé.
// GARDE-FOUS (non destructif) :
//   - on ne touche un doc QUE si son slug EN est encore le miroir du FR (backfill) ou vide ;
//     un slug EN déjà personnalisé n'est JAMAIS écrasé ;
//   - écriture en locale 'en' uniquement (le FR n'est jamais modifié) ;
//   - unicité garantie par suffixe -2, -3… au sein de la locale EN ;
//   - mode dry-run par défaut (rapport sans écriture).
import type { Payload } from 'payload'

// Pages structurelles : slug FR → slug EN voulu.
const PAGE_SLUG_OVERRIDES: Record<string, string> = {
  'a-propos': 'about',
  'mentions-legales': 'legal-notice',
  confidentialite: 'privacy',
  accessibilite: 'accessibility',
  ressources: 'resources',
}

// Slugs à ne JAMAIS changer : 'home' est spécial-casé par le routing ([locale]/page.tsx
// interroge slug 'home'), 'contact' est identique dans les deux langues.
const PAGE_SLUG_KEEP = new Set(['home', 'contact'])

// Pôles (Expertises) : titre NON localisé → traduction manuelle des slugs, figée ici.
// « web-experience » est identique en anglais → absent de la table (EN=FR conservé).
// Tout pôle futur absent de cette table est simplement signalé dans le rapport.
const EXPERTISE_SLUG_OVERRIDES: Record<string, string> = {
  'marque-contenu': 'brand-content',
  'performance-visibilite': 'performance-visibility',
  'digitalisation-process': 'digitalization-process',
}

export type SlugChange = {
  id: string | number
  label: string
  slugFr: string
  slugEnBefore: string | undefined
  slugEnAfter?: string
  action: 'updated' | 'planned' | 'skipped' | 'error'
  reason: string
}

export type SeedEnSlugsResult = {
  dryRun: boolean
  collections: Record<string, SlugChange[]>
  summary: { updated: number; planned: number; skipped: number; errors: number }
}

// Slug au format Payload : minuscules, sans accents, tirets.
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents (diacritiques combinants après NFD)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type LocalizedMap = Record<string, unknown> | undefined

function fromLocaleMap(value: unknown, locale: 'fr' | 'en'): string | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = (value as Record<string, unknown>)[locale]
    return typeof v === 'string' ? v : undefined
  }
  // Champ non localisé → même valeur pour toutes les langues.
  return typeof value === 'string' ? value : undefined
}

// Garantit l'unicité du slug dans la locale EN de la collection (suffixe -2, -3…).
function ensureUnique(candidate: string, taken: Set<string>): string {
  if (!taken.has(candidate)) return candidate
  for (let i = 2; ; i++) {
    const withSuffix = `${candidate}-${i}`
    if (!taken.has(withSuffix)) return withSuffix
  }
}

async function processCollection(opts: {
  payload: Payload
  collection: string
  dryRun: boolean
  // Calcule le slug EN voulu pour un doc (undefined = rien à faire).
  computeCandidate: (doc: Record<string, unknown>, slugFr: string) => Promise<string | undefined>
  labelOf: (doc: Record<string, unknown>) => string
}): Promise<SlugChange[]> {
  const { payload, collection, dryRun, computeCandidate, labelOf } = opts
  const changes: SlugChange[] = []

  // locale 'all' → les champs localisés reviennent en maps { fr, en }.
  // On ne renvoie JAMAIS ce doc en update (relations populées) : on n'écrit que { slug }.
  const { docs } = await payload.find({
    collection: collection as any,
    locale: 'all',
    fallbackLocale: false,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  // Slugs EN déjà pris dans la collection (pour l'unicité).
  const takenEn = new Set<string>()
  for (const doc of docs) {
    const slugEn = fromLocaleMap((doc as Record<string, unknown>).slug as LocalizedMap, 'en')
    if (slugEn) takenEn.add(slugEn)
  }

  for (const rawDoc of docs) {
    const doc = rawDoc as Record<string, unknown>
    const slugFr = fromLocaleMap(doc.slug as LocalizedMap, 'fr')
    const slugEnBefore = fromLocaleMap(doc.slug as LocalizedMap, 'en')
    const base = { id: doc.id as string | number, label: labelOf(doc), slugFr: slugFr ?? '', slugEnBefore }

    if (!slugFr) {
      changes.push({ ...base, action: 'skipped', reason: 'pas de slug FR' })
      continue
    }
    // Non destructif : un slug EN déjà différent du FR a été choisi à la main → intouchable.
    if (slugEnBefore && slugEnBefore !== slugFr) {
      changes.push({ ...base, action: 'skipped', reason: 'slug EN déjà personnalisé — conservé' })
      continue
    }

    try {
      const wanted = await computeCandidate(doc, slugFr)
      if (!wanted || wanted === slugEnBefore) {
        changes.push({ ...base, action: 'skipped', reason: wanted ? 'déjà correct' : 'pas de titre EN traduit — slug FR conservé (zéro 404)' })
        continue
      }
      // L'ancien slug EN du doc se libère, le nouveau se réserve.
      if (slugEnBefore) takenEn.delete(slugEnBefore)
      const unique = ensureUnique(wanted, takenEn)
      takenEn.add(unique)

      if (dryRun) {
        changes.push({ ...base, slugEnAfter: unique, action: 'planned', reason: 'dry-run — aucune écriture' })
        continue
      }
      try {
        await payload.update({
          collection: collection as any,
          id: doc.id as string | number,
          locale: 'en',
          fallbackLocale: false,
          depth: 0,
          overrideAccess: true,
          data: { slug: unique } as any,
        })
        changes.push({ ...base, slugEnAfter: unique, action: 'updated', reason: 'slug EN écrit (locale en uniquement)' })
      } catch (updateErr) {
        // Payload valide TOUT le document à l'update : si la page contient des blocs dont
        // un champ requis localisé est vide en EN (titres non traduits), la sauvegarde EN
        // est refusée même pour un simple slug. Plan B chirurgical : écriture SQL directe
        // du slug dans la table _locales (ligne EN créée par le backfill de migration).
        const isValidation =
          updateErr instanceof Error && /invalid|ValidationError/i.test(`${updateErr.name} ${updateErr.message}`)
        if (!isValidation) throw updateErr
        const table = `${collection.replace(/-/g, '_')}_locales`
        const result = await (payload.db as any).pool.query(
          `UPDATE ${table} SET slug = $1 WHERE _parent_id = $2 AND _locale = 'en'`,
          [unique, doc.id],
        )
        if (result.rowCount === 1) {
          changes.push({
            ...base,
            slugEnAfter: unique,
            action: 'updated',
            reason: 'slug EN écrit en SQL direct (validation de blocs EN incomplets contournée)',
          })
        } else {
          changes.push({
            ...base,
            action: 'error',
            reason: `SQL direct : ${result.rowCount} ligne(s) touchée(s) dans ${table} (attendu 1)`,
          })
        }
      }
    } catch (err) {
      changes.push({
        ...base,
        action: 'error',
        reason: err instanceof Error ? err.message : String(err),
      })
    }
  }
  return changes
}

export async function seedEnSlugs(payload: Payload, { dryRun = true }: { dryRun?: boolean } = {}): Promise<SeedEnSlugsResult> {
  const collections: Record<string, SlugChange[]> = {}

  // ── Pages : overrides structurels, sinon slug depuis le titre EN traduit ──────
  collections.pages = await processCollection({
    payload,
    collection: 'pages',
    dryRun,
    labelOf: (doc) => fromLocaleMap(doc.title as LocalizedMap, 'fr') ?? String(doc.id),
    computeCandidate: async (doc, slugFr) => {
      if (PAGE_SLUG_KEEP.has(slugFr)) return undefined // home/contact : jamais touchés
      const override = PAGE_SLUG_OVERRIDES[slugFr]
      if (override) return override
      const titleFr = fromLocaleMap(doc.title as LocalizedMap, 'fr')
      const titleEn = fromLocaleMap(doc.title as LocalizedMap, 'en')
      if (!titleEn?.trim() || titleEn === titleFr) return undefined
      return slugify(titleEn)
    },
  })

  // ── Articles (Posts) : slug depuis le titre EN (localisé) ─────────────────────
  collections.posts = await processCollection({
    payload,
    collection: 'posts',
    dryRun,
    labelOf: (doc) => fromLocaleMap(doc.title as LocalizedMap, 'fr') ?? String(doc.id),
    computeCandidate: async (doc) => {
      const titleFr = fromLocaleMap(doc.title as LocalizedMap, 'fr')
      const titleEn = fromLocaleMap(doc.title as LocalizedMap, 'en')
      if (!titleEn?.trim() || titleEn === titleFr) return undefined
      return slugify(titleEn)
    },
  })

  // ── Pôles (Expertises) : table de correspondance statique (traduction manuelle) ──
  collections.expertises = await processCollection({
    payload,
    collection: 'expertises',
    dryRun,
    labelOf: (doc) => (typeof doc.title === 'string' ? doc.title : String(doc.id)),
    computeCandidate: async (_doc, slugFr) => EXPERTISE_SLUG_OVERRIDES[slugFr],
  })
  collections.expertises = collections.expertises.map((c) =>
    c.action === 'skipped' && c.reason.startsWith('pas de titre EN') && !EXPERTISE_SLUG_OVERRIDES[c.slugFr]
      ? { ...c, reason: 'absent de EXPERTISE_SLUG_OVERRIDES — EN=FR conservé (ajouter la correspondance si besoin)' }
      : c,
  )

  // ── Réalisations (CaseStudies) : slug = nom du client (nom propre) → conservé ──
  // On ne traduit pas un nom propre ; EN=FR est le bon comportement. Rien à faire,
  // mais on le rend visible dans le rapport.
  collections['case-studies'] = await processCollection({
    payload,
    collection: 'case-studies',
    dryRun,
    labelOf: (doc) => (typeof doc.client_name === 'string' ? doc.client_name : String(doc.id)),
    computeCandidate: async () => undefined,
  })
  collections['case-studies'] = collections['case-studies'].map((c) =>
    c.action === 'skipped' ? { ...c, reason: 'nom de client (nom propre) — EN=FR conservé volontairement' } : c,
  )

  const all = Object.values(collections).flat()
  return {
    dryRun,
    collections,
    summary: {
      updated: all.filter((c) => c.action === 'updated').length,
      planned: all.filter((c) => c.action === 'planned').length,
      skipped: all.filter((c) => c.action === 'skipped').length,
      errors: all.filter((c) => c.action === 'error').length,
    },
  }
}
