import { describe, it, expect } from 'vitest'
import { localizeHref } from '@/utilities/localizeHref'

// Préfixage des liens internes par la locale active (évite les redirections 308).
describe('localizeHref', () => {
  it('renvoie la racine de la locale pour /, /home, null/undefined', () => {
    expect(localizeHref('/', 'fr')).toBe('/fr')
    expect(localizeHref('/home', 'en')).toBe('/en')
    expect(localizeHref(undefined, 'fr')).toBe('/fr')
    expect(localizeHref(null, 'en')).toBe('/en')
    expect(localizeHref('', 'fr')).toBe('/fr')
  })

  it('préfixe un lien interne non localisé', () => {
    expect(localizeHref('/services/audit', 'en')).toBe('/en/services/audit')
    expect(localizeHref('/contact', 'fr')).toBe('/fr/contact')
  })

  it('laisse intact un lien déjà préfixé par une locale', () => {
    expect(localizeHref('/en/services/audit', 'en')).toBe('/en/services/audit')
    expect(localizeHref('/fr/contact', 'en')).toBe('/fr/contact')
  })

  it('laisse intacts les liens externes, protocoles et //', () => {
    expect(localizeHref('https://exemple.com', 'fr')).toBe('https://exemple.com')
    expect(localizeHref('//cdn.exemple.com/x.js', 'fr')).toBe('//cdn.exemple.com/x.js')
    expect(localizeHref('mailto:hello@nrjka.com', 'fr')).toBe('mailto:hello@nrjka.com')
    expect(localizeHref('tel:+33123456789', 'en')).toBe('tel:+33123456789')
  })
})
