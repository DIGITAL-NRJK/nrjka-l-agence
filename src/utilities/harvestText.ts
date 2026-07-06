// Extraction de texte brut à partir de documents Payload (RAG).
// - lexicalToText : aplati un champ richText (lexical) en texte lisible.
// - harvestDoc : parcourt récursivement un doc et récolte le texte humain,
//   en ignorant les clés techniques (slugs, URLs, ids, métadonnées…).

type LexicalNode = {
  text?: string
  type?: string
  children?: LexicalNode[]
  root?: LexicalNode
}

const BLOCK_TYPES = new Set(['paragraph', 'heading', 'listitem', 'quote', 'list'])

export function lexicalToText(value: unknown): string {
  const node = value as LexicalNode | null
  if (!node || typeof node !== 'object') return ''

  const walk = (n?: LexicalNode | null): string => {
    if (!n) return ''
    if (typeof n.text === 'string') return n.text
    const children = n.children || n.root?.children
    if (Array.isArray(children)) {
      const inner = children.map(walk).join('')
      return n.type && BLOCK_TYPES.has(n.type) ? inner + '\n' : inner
    }
    return ''
  }

  return walk(node).replace(/\n{3,}/g, '\n\n').trim()
}

function isLexical(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'root' in (value as Record<string, unknown>) &&
      (value as { root?: { children?: unknown } }).root?.children,
  )
}

const SKIP_KEYS = new Set([
  'id',
  '_id',
  'slug',
  'url',
  'href',
  'link',
  'createdAt',
  'updatedAt',
  'publishedAt',
  '_status',
  'filename',
  'mimeType',
  'filesize',
  'width',
  'height',
  'focalX',
  'focalY',
  'thumbnailURL',
  'hash',
  'sizes',
  'blurhash',
  'embedding',
  'icon',
  'code',
  'locale',
  'metaTitle',
  'metaImage',
  'meta',
  'ext',
  'prefix',
  'appearance',
])

const looksTechnical = (s: string): boolean => {
  const t = s.trim()
  if (t.length < 3) return true
  if (/^https?:\/\//.test(t) || t.startsWith('/')) return true // URL / chemin
  if (/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(t)) return true // slug / valeur d'énum
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return true // date ISO
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(t)) return true // uuid
  return false
}

/** Récolte tout le texte humain d'un document Payload en une seule chaîne. */
export function harvestDoc(doc: unknown): string {
  const out: string[] = []

  const walk = (value: unknown, key?: string): void => {
    if (value == null) return
    if (key && SKIP_KEYS.has(key)) return

    if (typeof value === 'string') {
      if (!looksTechnical(value)) out.push(value.trim())
      return
    }
    if (typeof value === 'number' || typeof value === 'boolean') return

    if (isLexical(value)) {
      const t = lexicalToText(value)
      if (t) out.push(t)
      return
    }

    if (Array.isArray(value)) {
      value.forEach((v) => walk(v))
      return
    }

    if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        walk(v, k)
      }
    }
  }

  walk(doc)
  // Déduplique les lignes identiques (fallbacks localisés qui répètent le FR, etc.)
  const seen = new Set<string>()
  const lines = out
    .join('\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l || seen.has(l)) return false
      seen.add(l)
      return true
    })
  return lines.join('\n')
}

/** Découpe un texte en fragments d'environ maxLen caractères, avec léger recouvrement. */
export function chunkText(text: string, maxLen = 900, overlap = 150): string[] {
  const clean = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  if (!clean) return []

  const paragraphs = clean.split(/\n+/).map((p) => p.trim()).filter(Boolean)
  const chunks: string[] = []
  let current = ''

  const push = () => {
    const c = current.trim()
    if (c.length > 0) chunks.push(c)
  }

  for (const para of paragraphs) {
    if (para.length > maxLen) {
      // Paragraphe trop long : découpe dure par phrases.
      push()
      current = ''
      const sentences = para.split(/(?<=[.!?])\s+/)
      let buf = ''
      for (const s of sentences) {
        if ((buf + ' ' + s).trim().length > maxLen) {
          if (buf) chunks.push(buf.trim())
          buf = s
        } else {
          buf = (buf + ' ' + s).trim()
        }
      }
      if (buf) chunks.push(buf.trim())
      continue
    }
    if ((current + '\n' + para).trim().length > maxLen) {
      push()
      const tail = overlap > 0 ? current.slice(-overlap) : ''
      current = (tail + '\n' + para).trim()
    } else {
      current = (current + '\n' + para).trim()
    }
  }
  push()

  return chunks.filter((c) => c.length >= 20)
}
