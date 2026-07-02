'use client'
// Champ « Palette de couleurs » (Paramètres du site › Apparence) : remplace le select
// par une grille de cartes cliquables avec pastilles de couleurs. Source de vérité des
// palettes : src/utilities/palettes.ts. Enregistré dans importMap.js (entrée manuelle).
import React, { useCallback } from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'

import { DEFAULT_PALETTE, PALETTES } from '@/utilities/palettes'

export const PaletteField: SelectFieldClientComponent = (props) => {
  const { field, path } = props
  const { setValue, value } = useField<string>({ path: path ?? field?.name ?? 'colorScheme' })
  const current = typeof value === 'string' && value ? value : DEFAULT_PALETTE

  const onSelect = useCallback((next: string) => () => setValue(next), [setValue])

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <FieldLabel label={field?.label ?? 'Palette de couleurs'} path={path} />
      <div
        role="radiogroup"
        aria-label="Palette de couleurs"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '10px',
          marginTop: '8px',
        }}
      >
        {PALETTES.map((palette) => {
          const selected = palette.value === current
          return (
            <button
              key={palette.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={onSelect(palette.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                border: selected
                  ? '2px solid var(--theme-success-500, #2f7d5d)'
                  : '1px solid var(--theme-elevation-150, #d5d5d5)',
                background: 'var(--theme-elevation-0, #fff)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', gap: '4px' }} aria-hidden>
                {palette.swatches.map((color, i) => (
                  <span
                    key={i}
                    style={{
                      width: i === 0 ? '38px' : '22px',
                      height: '22px',
                      borderRadius: '5px',
                      background: color,
                      border: '1px solid rgba(0,0,0,0.12)',
                    }}
                  />
                ))}
              </span>
              <span style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.2 }}>
                {palette.label}
                {selected ? ' ✓' : ''}
              </span>
              <span style={{ fontSize: '12px', opacity: 0.75, lineHeight: 1.35 }}>
                {palette.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PaletteField
