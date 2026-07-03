'use client'
// Étiquette de bloc personnalisée (admin Payload) : affiche le nom FR de la section
// et une pastille « masqué » quand le bloc est retiré du site public.
// Branchée sur chaque bloc via withVisibility → admin.components.Label + importMap.js.
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

// blockType → libellé lisible (repris des configs de blocs).
const BLOCK_LABELS: Record<string, string> = {
  aboutHero: 'Hero À propos',
  archive: 'Archive',
  cta: 'Call to Action',
  caseStudiesIndex: 'Liste des réalisations',
  code: 'Code',
  commitments: 'Engagements',
  contact: 'Contact',
  content: 'Contenu',
  ctaFinal: 'CTA final',
  d4Cards: 'Cartes D4',
  distinctions: 'Distinctions',
  faq: 'FAQ',
  formBlock: 'Formulaire',
  lab: 'Lab',
  mediaBlock: 'Média',
  method: 'Méthode',
  partners: 'Expertise & réalisations',
  pillars: 'Piliers (Expertises)',
  presence: 'Carte de présence',
  promise: 'Promesse',
  resourcesBlock: 'Ressources',
  resourcesCatalog: 'Catalogue Ressources',
  statsBand: 'Bande de chiffres',
  team: 'Équipe',
  testimonialsBlock: 'Témoignages',
}

export const BlockRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ blockType?: string; hidden?: boolean }>()
  const type = data?.blockType
  const name = (type && BLOCK_LABELS[type]) || type || `Bloc ${(rowNumber ?? 0) + 1}`

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ opacity: data?.hidden ? 0.55 : 1 }}>{name}</span>
      {data?.hidden && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '2px 7px',
            borderRadius: '999px',
            background: 'var(--theme-elevation-100, #eee)',
            color: 'var(--theme-elevation-600, #666)',
          }}
        >
          Masqué
        </span>
      )}
    </span>
  )
}

export default BlockRowLabel
