'use client'

import React, { useMemo, useState } from 'react'
import { MapPin, Phone } from 'lucide-react'

import { WORLD_LAND_PATH, WORLD_VIEWBOX } from './worldLand'

export type PresenceLocation = {
  city?: string | null
  country?: string | null
  address?: string | null
  phone?: string | null
  lat?: number | null
  lng?: number | null
  isHeadquarters?: boolean | null
  id?: string | null
}

// Projection équirectangulaire — identique à celle qui a généré worldLand.ts
const projX = (lng: number) => ((lng + 180) / 360) * WORLD_VIEWBOX.w
const projY = (lat: number) => ((90 - lat) / 180) * WORLD_VIEWBOX.h

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export const PresenceMapClient: React.FC<{ locations: PresenceLocation[] }> = ({ locations }) => {
  const points = useMemo(
    () =>
      locations
        .map((loc, index) => ({ loc, index }))
        .filter(
          ({ loc }) => typeof loc.lat === 'number' && typeof loc.lng === 'number',
        )
        .map(({ loc, index }) => ({
          index,
          loc,
          x: projX(loc.lng as number),
          y: projY(loc.lat as number),
        })),
    [locations],
  )

  const [selected, setSelected] = useState<number>(() => points[0]?.index ?? 0)

  // viewBox auto-ajusté à l'ensemble des points (recadrage automatique)
  const viewBox = useMemo(() => {
    if (points.length === 0) return `0 0 ${WORLD_VIEWBOX.w} ${WORLD_VIEWBOX.h}`
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    let minX = Math.min(...xs)
    let maxX = Math.max(...xs)
    let minY = Math.min(...ys)
    let maxY = Math.max(...ys)

    // marge autour des points
    const padBase = 90
    const spanX = maxX - minX
    const spanY = maxY - minY
    const pad = padBase + Math.max(spanX, spanY) * 0.35
    minX -= pad
    maxX += pad
    minY -= pad
    maxY += pad

    // forcer un ratio agréable (largeur/hauteur ≈ 1.5)
    const targetRatio = 1.5
    let w = maxX - minX
    let h = maxY - minY
    if (w / h < targetRatio) {
      const newW = h * targetRatio
      const cx = (minX + maxX) / 2
      minX = cx - newW / 2
      maxX = cx + newW / 2
      w = newW
    } else {
      const newH = w / targetRatio
      const cy = (minY + maxY) / 2
      minY = cy - newH / 2
      maxY = cy + newH / 2
      h = newH
    }

    // rester dans les limites du monde
    minX = clamp(minX, 0, WORLD_VIEWBOX.w - w)
    minY = clamp(minY, 0, WORLD_VIEWBOX.h - h)
    if (w > WORLD_VIEWBOX.w) {
      minX = 0
      w = WORLD_VIEWBOX.w
    }
    if (h > WORLD_VIEWBOX.h) {
      minY = 0
      h = WORLD_VIEWBOX.h
    }

    return { x: minX, y: minY, w, h, str: `${minX} ${minY} ${w} ${h}` }
  }, [points])

  const vb = typeof viewBox === 'string' ? null : viewBox
  const dotR = vb ? vb.w * 0.011 : 12

  // groupement par pays, ordre d'apparition
  const grouped = useMemo(() => {
    const map = new Map<string, { index: number; loc: PresenceLocation }[]>()
    locations.forEach((loc, index) => {
      const key = loc.country || 'Autre'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push({ index, loc })
    })
    return Array.from(map.entries())
  }, [locations])

  const active = locations[selected]

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
      {/* Colonne gauche : liste + détail */}
      <div>
        <div className="space-y-6">
          {grouped.map(([country, items]) => (
            <div key={country}>
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate">
                {country}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(({ index, loc }) => {
                  const isActive = index === selected
                  return (
                    <button
                      key={loc.id || index}
                      type="button"
                      onClick={() => setSelected(index)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        isActive
                          ? 'border-terracotta bg-terracotta/10 text-ink'
                          : 'border-border text-slate hover:border-brand/30 hover:text-ink'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-terracotta' : 'bg-slate/50'}`}
                      />
                      {loc.city}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Détail de la ville sélectionnée */}
        {active && (
          <div className="mt-8 rounded-2xl border border-border bg-surface-soft p-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                {active.city}
              </h3>
              {active.isHeadquarters && (
                <span className="rounded-full bg-brand px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-white">
                  Siège
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-slate">{active.country}</p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" strokeWidth={2.2} />
                {active.address ? (
                  <span className="whitespace-pre-line leading-relaxed text-ink">
                    {active.address}
                  </span>
                ) : (
                  <span className="italic text-slate">Adresse à venir</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2.2} />
                {active.phone ? (
                  <a
                    href={`tel:${active.phone.replace(/\s/g, '')}`}
                    className="text-ink transition-colors hover:text-terracotta-dark"
                  >
                    {active.phone}
                  </a>
                ) : (
                  <span className="italic text-slate">Téléphone à venir</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Colonne droite : carte */}
      <div className="overflow-hidden rounded-3xl border border-border bg-brand">
        <svg
          viewBox={typeof viewBox === 'string' ? viewBox : viewBox.str}
          className="w-full"
          style={{ aspectRatio: vb ? vb.w / vb.h : 2 }}
          role="img"
          aria-label="Carte des implantations de l’agence"
        >
          {/* terres */}
          <path d={WORLD_LAND_PATH} className="fill-white/[0.06] stroke-white/15" strokeWidth={0.8} />

          {/* liens fins entre les points et le point sélectionné */}
          {vb &&
            points.map((p) => {
              const sel = points.find((q) => q.index === selected)
              if (!sel || p.index === selected) return null
              return (
                <line
                  key={`l-${p.index}`}
                  x1={sel.x}
                  y1={sel.y}
                  x2={p.x}
                  y2={p.y}
                  className="stroke-terracotta/25"
                  strokeWidth={vb.w * 0.0012}
                  strokeDasharray={`${vb.w * 0.006} ${vb.w * 0.006}`}
                />
              )
            })}

          {/* points */}
          {points.map((p) => {
            const isActive = p.index === selected
            return (
              <g
                key={p.index}
                onClick={() => setSelected(p.index)}
                className="cursor-pointer"
                role="button"
                aria-label={p.loc.city || undefined}
              >
                {isActive && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={dotR * 2.4}
                    className="fill-terracotta/20 presence-pulse"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? dotR * 1.35 : dotR}
                  className={isActive ? 'fill-terracotta' : 'fill-terracotta/70'}
                  stroke="white"
                  strokeWidth={dotR * 0.25}
                />
                {isActive && p.loc.city && (
                  <text
                    x={p.x}
                    y={p.y - dotR * 2.8}
                    textAnchor="middle"
                    className="fill-white font-medium"
                    style={{ fontSize: dotR * 2.1 }}
                  >
                    {p.loc.city}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <style>{`
        .presence-pulse { transform-box: fill-box; transform-origin: center; animation: presencePulse 2.4s ease-out infinite; }
        @keyframes presencePulse {
          0% { transform: scale(0.6); opacity: 0.6; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .presence-pulse { animation: none; } }
      `}</style>
    </div>
  )
}
