// Client LLM générique (schéma compatible OpenAI) — embeddings + chat en streaming.
// Fonctionne avec l'API Mistral managée (défaut, données en Europe) OU un endpoint
// AUTO-HÉBERGÉ (Ollama / vLLM / TGI) exposant /v1/chat/completions et /v1/embeddings.
//
// La GÉNÉRATION et les EMBEDDINGS peuvent viser deux endpoints différents (mode
// HYBRIDE : génération sur Mistral managé + embeddings auto-hébergés sur VPS).
//
// Variables d'env (les AI_* priment ; repli sur MISTRAL_* pour compatibilité) :
//   Génération : AI_BASE_URL (défaut https://api.mistral.ai/v1) · AI_API_KEY (repli MISTRAL_API_KEY)
//                AI_CHAT_MODEL (repli MISTRAL_CHAT_MODEL, défaut mistral-small-latest)
//   Embeddings : AI_EMBED_BASE_URL (repli AI_BASE_URL) · AI_EMBED_API_KEY (repli AI_API_KEY/MISTRAL_API_KEY)
//                AI_EMBED_MODEL (défaut mistral-embed ; côté VPS ex. bge-m3 — non ouvert chez Mistral)
//
// ⚠️ Changer d'embedder (dimensions/espace différents) impose de relancer /reindex-kb.

const clean = (u: string) => u.replace(/\/+$/, '')

const CHAT_BASE_URL = clean(process.env.AI_BASE_URL || 'https://api.mistral.ai/v1')
const CHAT_API_KEY = process.env.AI_API_KEY || process.env.MISTRAL_API_KEY || ''

const EMBED_BASE_URL = clean(
  process.env.AI_EMBED_BASE_URL || process.env.AI_BASE_URL || 'https://api.mistral.ai/v1',
)
const EMBED_API_KEY =
  process.env.AI_EMBED_API_KEY || process.env.AI_API_KEY || process.env.MISTRAL_API_KEY || ''

export const EMBED_MODEL = process.env.AI_EMBED_MODEL || 'mistral-embed'
export const CHAT_MODEL =
  process.env.AI_CHAT_MODEL || process.env.MISTRAL_CHAT_MODEL || 'mistral-small-latest'

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

/**
 * Le chatbot est-il configuré ? Vrai si une clé managée est présente OU si un
 * endpoint auto-hébergé est défini. Utilisé par le layout (afficher le widget)
 * et les routes (garde d'accès).
 */
export function aiConfigured(): boolean {
  return Boolean(
    process.env.AI_API_KEY ||
      process.env.MISTRAL_API_KEY ||
      process.env.AI_BASE_URL ||
      process.env.AI_EMBED_BASE_URL,
  )
}

function headers(key: string, accept = 'application/json'): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json', Accept: accept }
  // Auth ajoutée seulement si une clé existe (endpoints locaux souvent sans auth).
  if (key) h.Authorization = `Bearer ${key}`
  return h
}

/** Embeddings par lot. Renvoie un vecteur par entrée, dans le même ordre. */
export async function embed(inputs: string[]): Promise<number[][]> {
  if (inputs.length === 0) return []
  const res = await fetch(`${EMBED_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: headers(EMBED_API_KEY),
    body: JSON.stringify({ model: EMBED_MODEL, input: inputs }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Embeddings ${res.status}: ${detail.slice(0, 300)}`)
  }
  const json = (await res.json()) as { data?: { embedding: number[]; index: number }[] }
  const data = json.data || []
  return data.sort((a, b) => a.index - b.index).map((d) => d.embedding)
}

export async function embedOne(input: string): Promise<number[]> {
  const [v] = await embed([input])
  return v || []
}

/** Similarité cosinus entre deux vecteurs de même dimension. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || a.length !== b.length) return 0
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

/**
 * Chat en streaming. Générateur asynchrone qui produit les fragments de texte
 * (deltas) au fil de l'eau. Parse le flux SSE (compatible OpenAI/Mistral).
 */
export async function* streamChat(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; signal?: AbortSignal } = {},
): AsyncGenerator<string> {
  const res = await fetch(`${CHAT_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: headers(CHAT_API_KEY, 'text/event-stream'),
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      stream: true,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 800,
    }),
    signal: opts.signal,
  })

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Chat ${res.status}: ${detail.slice(0, 300)}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Le flux SSE sépare les événements par des doubles sauts de ligne.
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''

    for (const evt of events) {
      const line = evt.split('\n').find((l) => l.startsWith('data:'))
      if (!line) continue
      const data = line.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] }
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch {
        // fragment JSON incomplet : ignoré (rare avec le découpage \n\n)
      }
    }
  }
}
