/**
 * Temps de lecture estimé à partir d'un contenu Lexical (richText Payload).
 * Parcourt récursivement les nœuds pour compter les mots (~200 mots/min).
 */

type LexNode = { text?: unknown; children?: unknown }

function collectText(node: unknown, acc: string[]): void {
  if (!node || typeof node !== 'object') return
  const n = node as LexNode
  if (typeof n.text === 'string') acc.push(n.text)
  if (Array.isArray(n.children)) {
    for (const child of n.children) collectText(child, acc)
  }
}

export function readingTimeMinutes(content: unknown): number {
  const acc: string[] = []
  const root = (content as { root?: unknown } | null | undefined)?.root
  collectText(root, acc)
  const words = acc.join(' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function readingTimeLabel(content: unknown, locale = 'fr'): string {
  const m = readingTimeMinutes(content)
  return locale === 'en' ? `${m} min read` : `${m} min de lecture`
}
