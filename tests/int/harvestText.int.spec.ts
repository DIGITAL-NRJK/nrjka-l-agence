import { describe, it, expect } from 'vitest'
import { lexicalToText, harvestDoc, chunkText } from '@/utilities/harvestText'

// Extraction/segmentation de texte pour le RAG du chatbot.
describe('lexicalToText', () => {
  it('aplati les nœuds richText en texte lisible', () => {
    const doc = {
      root: {
        children: [
          { type: 'heading', children: [{ text: 'Nos services' }] },
          { type: 'paragraph', children: [{ text: 'Un accompagnement ' }, { text: 'sur mesure.' }] },
        ],
      },
    }
    const out = lexicalToText(doc)
    expect(out).toContain('Nos services')
    expect(out).toContain('Un accompagnement sur mesure.')
  })

  it('renvoie une chaîne vide pour une valeur non-lexical', () => {
    expect(lexicalToText(null)).toBe('')
    expect(lexicalToText('texte')).toBe('')
    expect(lexicalToText(42)).toBe('')
  })
})

describe('harvestDoc', () => {
  it('récolte le texte humain et ignore les clés techniques', () => {
    const doc = {
      id: 7,
      slug: 'nos-services',
      title: 'Nos services',
      description: 'Un accompagnement sur mesure pour votre marque.',
      createdAt: '2026-01-01T00:00:00Z',
      url: '/fr/services/nos-services',
    }
    const text = harvestDoc(doc)
    expect(text).toContain('Nos services')
    expect(text).toContain('Un accompagnement sur mesure pour votre marque.')
    expect(text).not.toContain('nos-services') // slug ignoré
    expect(text).not.toContain('2026-01-01') // date ignorée
  })

  it('déduplique les lignes identiques (fallbacks localisés)', () => {
    const text = harvestDoc({ title: 'Répétition', description: 'Répétition' })
    expect(text.match(/Répétition/g)?.length).toBe(1)
  })
})

describe('chunkText', () => {
  it('renvoie un tableau vide pour du vide ou du texte trop court', () => {
    expect(chunkText('')).toEqual([])
    expect(chunkText('court')).toEqual([])
  })

  it('découpe un long texte en plusieurs fragments bornés', () => {
    const para =
      'NRJKA accompagne les entreprises dans leur transformation digitale avec méthode et rigueur. '.repeat(
        8,
      )
    const text = [para, para, para].join('\n\n')
    const chunks = chunkText(text)
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.every((c) => c.length > 0)).toBe(true)
    // borne : maxLen (900) + overlap (150) + petite marge
    expect(chunks.every((c) => c.length <= 1100)).toBe(true)
  })
})
