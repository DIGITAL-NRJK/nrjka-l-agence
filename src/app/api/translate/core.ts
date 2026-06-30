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
// Traduit en profondeur un champ entier (groupe `hero`, tableau de blocs `layout`…) :
// parcourt récursivement la structure, traduit les textes des clés "texte" + le richtext,
// et préserve tout le reste (ids, types, URLs, médias, icônes, enums).
type LocalizedDeepField = { kind: 'localized_deep'; path: string }

export type FieldDescriptor =
  | LocalizedField
  | LocalizedRichTextField
  | ArrayLocalizedField
  | ManualEnField
  | RichtextManualEnField
  | ArrayManualEnField
  | LocalizedDeepField

// ─── Translation config per collection ───────────────────────────────────────
// Règles : seulement du texte (jamais blocs/medias). Les champs non-localisés sans
// pendant _en sont exclus (sinon on écraserait le FR en écrivant sur la locale 'en').

export const TRANSLATABLE_FIELDS: Record<string, FieldDescriptor[]> = {
  pages: [
    { kind: 'localized', path: 'meta.title' },
    { kind: 'localized', path: 'meta.description' },
    // Contenu visible : en-tête + tous les blocs du layout (titres, sous-titres, textes, richtext…).
    { kind: 'localized_deep', path: 'hero' },
    { kind: 'localized_deep', path: 'layout' },
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

export async function translateText(text: string): Promise<string> {
  if (!text?.trim()) return text

  const body: Record<string, string> = { q: text, source: 'fr', target: 'en', format: 'text' }
  if (process.env.LIBRETRANSLATE_API_KEY) body.api_key = process.env.LIBRETRANSLATE_API_KEY

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)
  try {
    const res = await fetch(`${LT_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`LibreTranslate ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return typeof data.translatedText === 'string' ? data.translatedText : text
  } finally {
    clearTimeout(timeout)
  }
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

// ─── Traduction "profonde" : groupe hero / blocs du layout ────────────────────
// On traduit les chaînes des clés NON listées ci-dessous (qui couvrent ids, types,
// URLs, slugs, médias, icônes, enums, valeurs neutres) + le richtext (objets `root`).
// Les ids de médias/relations sont des nombres → ignorés d'office. Le reste est préservé.
const DEEP_SKIP_KEYS = new Set(
  [
    'id', 'blockType', 'blockName', 'type', 'url', 'href', 'slug', 'icon', 'appearance',
    'relationTo', 'target', 'rel', 'value', 'name', 'reference', 'linkType', 'size', 'width',
    'color', 'colorScheme', 'variant', 'mode', 'format', 'email', 'phone', 'telephone', 'date',
    'image', 'media', 'logo', 'photo', 'avatar', 'file', 'background', 'video', 'poster',
    'createdAt', 'updatedAt', 'publishedAt', 'position', 'order',
  ].map((k) => k.toLowerCase()),
)

export async function translateDeep(value: unknown, key?: string): Promise<unknown> {
  // Richtext lexical (objet avec `root`) → traducteur dédié.
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'root' in (value as Record<string, unknown>)
  ) {
    return translateLexical(value)
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => translateDeep(item)))
  }
  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(
        async ([k, v]) => [k, await translateDeep(v, k)] as const,
      ),
    )
    return Object.fromEntries(entries)
  }
  if (typeof value === 'string' && key && !DEEP_SKIP_KEYS.has(key.toLowerCase()) && value.trim()) {
    return translateText(value)
  }
  return value
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
      if (descriptor.kind === 'localized_deep') {
        const value = getNestedValue(docData, descriptor.path)
        if (value && typeof value === 'object') {
          setNestedValue(localizedData, descriptor.path, await translateDeep(value))
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
