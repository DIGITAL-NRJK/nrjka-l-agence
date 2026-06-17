'use client'

import React from 'react'

/**
 * Cellule personnalisée pour la colonne « Intitulé (chemin) » de la liste Catégories.
 * Affiche le nom propre de la catégorie, INDENTÉ selon sa profondeur (déduite du
 * nombre de « › » dans le chemin) → rendu en arbre : pôle, puis sous-catégories
 * indentées dessous (la liste est triée par chemin, donc déjà groupée).
 */
export const CategoryTreeCell: React.FC<{ cellData?: unknown }> = ({ cellData }) => {
  const path = typeof cellData === 'string' ? cellData : ''
  const segments = path.split(' › ').filter(Boolean)
  const depth = Math.max(segments.length - 1, 0)
  const label = segments[segments.length - 1] || path || '—'

  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: `${depth * 1.4}rem` }}
    >
      {depth > 0 && (
        <span aria-hidden style={{ marginRight: '0.4rem', opacity: 0.45 }}>
          ↳
        </span>
      )}
      {label}
    </span>
  )
}
