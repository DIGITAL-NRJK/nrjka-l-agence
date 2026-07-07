import { describe, it, expect } from 'vitest'
import { cosineSimilarity } from '@/utilities/mistral'

// Cœur de la recherche RAG : classement des fragments par proximité sémantique.
describe('cosineSimilarity', () => {
  it('vaut 1 pour des vecteurs identiques', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1)
  })

  it('vaut ~1 pour des vecteurs colinéaires', () => {
    expect(cosineSimilarity([1, 1], [2, 2])).toBeCloseTo(1)
  })

  it('vaut 0 pour des vecteurs orthogonaux', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0)
  })

  it('renvoie 0 si les longueurs diffèrent', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2])).toBe(0)
  })

  it('renvoie 0 pour un vecteur vide ou de norme nulle', () => {
    expect(cosineSimilarity([], [])).toBe(0)
    expect(cosineSimilarity([0, 0], [0, 0])).toBe(0)
  })
})
