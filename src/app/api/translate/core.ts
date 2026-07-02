/* eslint-disable @typescript-eslint/no-explicit-any */
// Logique de traduction FR→EN partagée par /api/translate (un doc) et /api/translate-all (lot).
import type { Payload } from 'payload'

// ─── Field descriptor types ───────────────────────────────────────────────────

type LocalizedField = { kind: 'localized'; path: string }
type LocalizedRichTextField = { kind: 'localized_richtext'; path: string }
type ArrayLocalizedField = { kind: 'array_localized'; array: string; fields: string[] }
type ManualEnField = { kind: 'manual_en'; source: string; target: string }
type RichtextManualEnField = { kind: 'richtext_manual_en'; source: string; target: string }
type ArrayManualEnField = {
  kind: 'array_manual_en'
  array: string
  pairs: Array<{ source: string; target: string }>
}
export type FieldDescriptor =
  | LocalizedField
  | LocalizedRichTextField
  | ArrayLocalizedField
  | ManualEnField
  | RichtextManualEnField
  | ArrayManualEnField

// ─── Translation config per collection ───────────────────────────────────────
// Règles : seulement du texte (jamais blocs/medias). Les champs non-localisés sans
// pendant _en sont exclus (sinon on écraserait le FR en écrivant sur la locale 'en').

export const TRANSLATABLE_FIELDS: Record<string, FieldDescriptor[]> = {
  // Pages : traitées par voie dédiée (translateLocalizedDocument, lecture FR + EN),
  // car 100 % localisées avec blocs/tableaux. Cette entrée sert juste à autoriser la collection.
  pages: [
    { kind: 'localized', path: 'meta.title' },
    { kind: 'localized', path: 'meta.description' },
  ],
  posts: [
    { kind: 'localized', path: 'title' },
    { kind: 'localized_richtext', path: 'content' },
    { kind: 'localized', path: 'meta.title' },
    { kind: 'localized', path: 'meta.description' },
  ],
  expertises: [
    { kind: 'localized', path: 'subtitle' },
    { kind: 'localized', path: 'description' },
    { kind: 'array_localized', array: 'benefits', fields: ['benefit'] },
    { kind: 'array_localized', array: 'process_steps', fields: ['title', 'description'] },
    { kind: 'array_localized', array: 'faqs', fields: ['question', 'answer'] },
  ],
  services: [
    { kind: 'manual_en', source: 'title', target: 'title_en' },
    { kind: 'manual_en', source: 'description', target: 'description_en' },
    { kind: 'richtext_manual_en', source: 'long_description', target: 'long_description_en' },
    { kind: 'array_manual_en', array: 'features', pairs: [{ source: 'feature', target: 'feature_en' }] },
    { kind: 'array_manual_en', array: 'benefits', pairs: [{ source: 'benefit', target: 'benefit_en' }] },
    {
      kind: 'array_manual_en',
      array: 'faqs',
      pairs: [
        { source: 'question', target: 'question_en' },
        { source: 'answer', target: 'answer_en' },
      ],
    },
  ],
  testimonials: [{ kind: 'manual_en', source: 'content', target: 'content_en' }],
  'case-studies': [
    { kind: 'manual_en', source: 'excerpt', target: 'excerpt_en' },
    { kind: 'richtext_manual_en', source: 'challenge', target: 'challenge_en' },
    { kind: 'richtext_manual_en', source: 'solution', target: 'solution_en' },
    { kind: 'richtext_manual_en', source: 'results', target: 'results_en' },
    { kind: 'array_manual_en', array: 'testimonials', pairs: [{ source: 'quote', target: 'quote_en' }] },
  ],
  resources: [
    { kind: 'manual_en', source: 'title', target: 'title_en' },
    { kind: 'manual_en', source: 'description', target: 'description_en' },
    { kind: 'array_manual_en', array: 'features', pairs: [{ source: 'feature', target: 'feature_en' }] },
  ],
  'job-offers': [
    { kind: 'manual_en', source: 'title', target: 'title_en' },
    { kind: 'richtext_manual_en', source: 'description', target: 'description_en' },
    { kind: 'array_manual_en', array: 'responsibilities', pairs: [{ source: 'item', target: 'item_en' }] },
    { kind: 'array_manual_en', array: 'requirements', pairs: [{ source: 'item', target: 'item_en' }] },
    { kind: 'array_manual_en', array: 'benefits', pairs: [{ source: 'item', target: 'item_en' }] },
  ],
}

// Libellés FR pour l'UI « Tout traduire » (ordre d'exécution).
export const TRANSLATABLE_COLLECTIONS: { slug: string; label: string }[] = [
  { slug: 'pages', label: 'Pages' },
  { slug: 'posts', label: 'Articles' },
  { slug: 'services', label: 'Services' },
  { slug: 'expertises', label: 'Pôles & expertises' },
  { slug: 'testimonials', label: 'Témoignages' },
  { slug: 'case-studies', label: 'Réalisations' },
  { slug: 'resources', label: 'Ressources' },
  { slug: 'job-offers', label: 'Offres d’emploi' },
]

// ─── LibreTranslate ───────────────────────────────────────────────────────────

const LT_URL = (process.env.LIBRETRANSLATE_URL ?? 'https://translate.nrjka.com').replace(/\/$/, '')

// Limiteur de concurrence : l'instance LibreTranslate auto-hébergée sature (502) si on
// l'inonde de requêtes parallèles (une page = beaucoup de champs). On plafonne les appels
// simultanés et on file le reste dans une attente.
const MAX_CONCURRENT = 3
let activeRequests = 0
const waitQueue: Array<() => void> = []

async function withLimit<T>(fn: () => Promise<T>): Promise<T> {
  if (activeRequests >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => waitQueue.push(resolve))
  }
  activeRequests++
  try {
    return await fn()
  } finally {
    activeRequests--
    waitQueue.shift()?.()
  }
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function translateTextOnce(text: string): Promise<string> {
  const body: Record<string, string> = { q: text, source: 'fr', target: 'en', format: 'text' }
  if (process.env.LIBRETRANSLATE_API_KEY) body.api_key = process.env.LIBRETRANSLATE_API_KEY

  let lastError: Error = new Error('LibreTranslate: échec inconnu')
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(500 * 2 ** (attempt - 1)) // 0.5s, 1s, 2s
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    try {
      const res = await fetch(`${LT_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (RETRYABLE_STATUS.has(res.status)) {
        lastError = new Error(`LibreTranslate ${res.status} (transitoire)`)
        continue // réessaie
      }
      if (!res.ok) throw new Error(`LibreTranslate ${res.status}: ${(await res.text()).slice(0, 200)}`)
      const data = await res.json()
      return typeof data.translatedText === 'string' ? data.translatedText : text
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('LibreTranslate: erreur réseau')
      // erreurs réseau/timeout → réessaie aussi
    } finally {
      clearTimeout(timeout)
    }
  }
  throw lastError
}

export async function translateText(text: string): Promise<string> {
  if (!text?.trim()) return text
  return withLimit(() => translateTextOnce(text))
}

// ─── Lexical richText : traduit récursivement les nœuds texte, préserve le reste ──

export async function translateLexical(node: unknown): Promise<unknown> {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return node
  const obj = node as Record<string, unknown>

  if ('root' in obj && obj.root && typeof obj.root === 'object') {
    return { ...obj, root: await translateLexical(obj.root) }
  }
  if (obj.type === 'text' && typeof obj.text === 'string' && obj.text.trim()) {
    return { ...obj, text: await translateText(obj.text) }
  }
  if (Array.isArray(obj.children)) {
    const translatedChildren = await Promise.all(obj.children.map((c) => translateLexical(c)))
    return { ...obj, children: translatedChildren }
  }
  return obj
}

// ─── Traduction d'un document ENTIÈREMENT localisé (pages…) ───────────────────
// On lit le doc en FR (source) ET en EN (cible), sans fallback. On ne traduit que les champs
// TEXTE connus (liste d'inclusion → jamais un enum/slug/url/icône).
// Point CLÉ des ids : sur ce schéma, les lignes de blocs/tableaux ont des ids PAR LANGUE.
// Envoyer un id FR dans le payload EN provoque « Value must be unique ». Donc :
//   - id présent côté EN (cible) → réutilisé → Payload MET À JOUR la ligne EN ;
//   - sinon → pas d'id → Payload CRÉE la ligne EN ;
//   - jamais un id issu du doc FR (garde-fou collectIDs).
const TGT_LOCALE = 'en'
const SRC_LOCALE = 'fr'

// Champs de la page à traduire (le reste — média, réglages… — n'est pas touché).
const PAGE_FIELD_PATHS = ['title', 'hero', 'layout', 'meta.title', 'meta.description']

// Clés de champs TEXTE à traduire (liste d'inclusion : tout le reste est préservé tel quel).
const TRANSLATABLE_PAGE_STRING_KEYS = new Set([
  'title', 'titleAccent', 'subtitle', 'subheading', 'heading', 'description', 'excerpt',
  'eyebrow', 'label', 'badge', 'text', 'content', 'caption', 'quote', 'question', 'answer',
  'intro', 'role', 'tag', 'buttonLabel', 'linkLabel', 'ctaLabel',
])

const SYSTEM_KEYS = new Set(['createdAt', 'updatedAt'])

// Collecte récursivement tous les `id` d'un document (sert à interdire de réémettre un id FR).
function collectIDs(value: unknown, ids = new Set<unknown>()): Set<unknown> {
  if (Array.isArray(value)) {
    value.forEach((item) => collectIDs(item, ids))
    return ids
  }
  if (!value || typeof value !== 'object') return ids
  const obj = value as Record<string, unknown>
  if (obj.id !== undefined) ids.add(obj.id)
  Object.values(obj).forEach((child) => collectIDs(child, ids))
  return ids
}

function getTargetID(targetValue: unknown): unknown {
  if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
    return (targetValue as Record<string, unknown>).id
  }
  return undefined
}

// Traduit une valeur FR en s'appuyant sur la valeur EN existante (targetValue) pour réutiliser
// les ids EN des lignes. `sourceIDs` = ensemble des ids du doc FR, jamais réémis côté EN.
async function translatePageValue(
  sourceValue: unknown,
  targetValue: unknown,
  sourceIDs: Set<unknown>,
  key = '',
): Promise<unknown> {
  if (typeof sourceValue === 'string') {
    if (!sourceValue.trim() || !TRANSLATABLE_PAGE_STRING_KEYS.has(key)) return sourceValue
    return translateText(sourceValue)
  }
  if (Array.isArray(sourceValue)) {
    const targetArray = Array.isArray(targetValue) ? targetValue : []
    return Promise.all(
      sourceValue.map((sourceItem, index) =>
        translatePageValue(sourceItem, targetArray[index], sourceIDs, key),
      ),
    )
  }
  if (!sourceValue || typeof sourceValue !== 'object') return sourceValue

  const sourceObj = sourceValue as Record<string, unknown>
  // Richtext (lexical) → traducteur dédié.
  if (sourceObj.root && typeof sourceObj.root === 'object') return translateLexical(sourceObj)

  const targetObj =
    targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)
      ? (targetValue as Record<string, unknown>)
      : {}

  const output: Record<string, unknown> = {}
  // On ne réutilise QUE l'id EN (cible), et jamais un id issu du doc FR.
  const targetID = getTargetID(targetObj)
  if (targetID !== undefined && !sourceIDs.has(targetID)) output.id = targetID

  for (const [childKey, childValue] of Object.entries(sourceObj)) {
    if (childKey === 'id' || SYSTEM_KEYS.has(childKey)) continue
    output[childKey] = await translatePageValue(childValue, targetObj[childKey], sourceIDs, childKey)
  }
  return output
}

async function translateLocalizedDocument(
  payload: Payload,
  collection: string,
  id: string | number,
): Promise<string[]> {
  const sourceDoc = await payload.findByID({
    collection: collection as any,
    id,
    locale: SRC_LOCALE,
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  if (!sourceDoc) return []

  const targetDoc = await payload.findByID({
    collection: collection as any,
    id,
    locale: TGT_LOCALE,
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })

  const sourceData = sourceDoc as Record<string, unknown>
  const targetData = (targetDoc ?? {}) as Record<string, unknown>
  const sourceIDs = collectIDs(sourceDoc)

  const data: Record<string, unknown> = {}
  const translatedKeys: string[] = []

  for (const path of PAGE_FIELD_PATHS) {
    const sourceValue = getNestedValue(sourceData, path)
    if (sourceValue === undefined || sourceValue === null) continue
    const targetValue = getNestedValue(targetData, path)
    const translated = await translatePageValue(
      sourceValue,
      targetValue,
      sourceIDs,
      path.split('.').at(-1) ?? '',
    )
    setNestedValue(data, path, translated)
    translatedKeys.push(path)
  }

  if (translatedKeys.length === 0) return []

  await payload.update({
    collection: collection as any,
    id,
    locale: TGT_LOCALE,
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
    data: data as any,
  })
  return translatedKeys
}

// ─── Helpers chemins pointés ──────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.')
  let cursor = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    if (!cursor[k] || typeof cursor[k] !== 'object') cursor[k] = {}
    cursor = cursor[k] as Record<string, unknown>
  }
  cursor[keys[keys.length - 1]!] = value
}

// ─── Traduction d'un document ─────────────────────────────────────────────────
// Lit le doc en FR, traduit les champs configurés, écrit la version EN.
// Retourne la liste des clés traduites (vide si rien à faire).

export async function translateDocument(
  payload: Payload,
  collection: string,
  id: string | number,
): Promise<string[]> {
  const descriptors = TRANSLATABLE_FIELDS[collection]
  if (!descriptors) return []

  // Collections 100 % localisées avec blocs/tableaux (pages) → voie toutes-locales dédiée.
  if (collection === 'pages') return translateLocalizedDocument(payload, collection, id)

  const doc = await payload.findByID({
    collection: collection as any,
    id,
    locale: 'fr',
    depth: 0,
  })
  if (!doc) return []

  const docData = doc as unknown as Record<string, unknown>
  const localizedData: Record<string, unknown> = {}
  const directData: Record<string, unknown> = {}
  const translatedKeys: string[] = []

  await Promise.all(
    descriptors.map(async (descriptor) => {
      if (descriptor.kind === 'localized') {
        const value = getNestedValue(docData, descriptor.path)
        if (typeof value === 'string' && value.trim()) {
          setNestedValue(localizedData, descriptor.path, await translateText(value))
          translatedKeys.push(descriptor.path)
        }
        return
      }
      if (descriptor.kind === 'array_localized') {
        const arr = docData[descriptor.array]
        if (!Array.isArray(arr) || arr.length === 0) return
        const translatedArr = await Promise.all(
          arr.map(async (item: Record<string, unknown>) => {
            const updated: Record<string, unknown> = { ...item }
            await Promise.all(
              descriptor.fields.map(async (fieldName) => {
                const value = item[fieldName]
                if (typeof value === 'string' && value.trim()) updated[fieldName] = await translateText(value)
              }),
            )
            return updated
          }),
        )
        localizedData[descriptor.array] = translatedArr
        translatedKeys.push(`${descriptor.array}[].${descriptor.fields.join('+')}`)
        return
      }
      if (descriptor.kind === 'localized_richtext') {
        const value = getNestedValue(docData, descriptor.path)
        if (value && typeof value === 'object') {
          setNestedValue(localizedData, descriptor.path, await translateLexical(value))
          translatedKeys.push(descriptor.path)
        }
        return
      }
      if (descriptor.kind === 'manual_en') {
        const value = docData[descriptor.source]
        if (typeof value === 'string' && value.trim()) {
          directData[descriptor.target] = await translateText(value)
          translatedKeys.push(descriptor.target)
        }
        return
      }
      if (descriptor.kind === 'richtext_manual_en') {
        const value = docData[descriptor.source]
        if (value && typeof value === 'object') {
          directData[descriptor.target] = await translateLexical(value)
          translatedKeys.push(descriptor.target)
        }
        return
      }
      if (descriptor.kind === 'array_manual_en') {
        const arr = docData[descriptor.array]
        if (!Array.isArray(arr) || arr.length === 0) return
        const translatedArr = await Promise.all(
          arr.map(async (item: Record<string, unknown>) => {
            const updated: Record<string, unknown> = { ...item }
            await Promise.all(
              descriptor.pairs.map(async ({ source, target }) => {
                const value = item[source]
                if (typeof value === 'string' && value.trim()) updated[target] = await translateText(value)
              }),
            )
            return updated
          }),
        )
        directData[descriptor.array] = translatedArr
        translatedKeys.push(`${descriptor.array}[].${descriptor.pairs.map((p) => p.target).join('+')}`)
      }
    }),
  )

  if (translatedKeys.length === 0) return []

  if (Object.keys(localizedData).length > 0) {
    await payload.update({ collection: collection as any, id, locale: 'en', data: localizedData as any })
  }
  if (Object.keys(directData).length > 0) {
    await payload.update({ collection: collection as any, id, data: directData as any })
  }

  return translatedKeys
}
