// Slug d'auteur dérivé du nom (pas de champ en base) — accents retirés, minuscule, tirets.
// Ex. « Élodie Martin » → « elodie-martin ».
export const authorSlug = (name?: string | null): string =>
  (name || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
