import React from 'react'

/**
 * Rend un bloc de données structurées schema.org (JSON-LD).
 * `data` peut être un objet unique ou un tableau d'objets (ex. Article + fil d'Ariane).
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
