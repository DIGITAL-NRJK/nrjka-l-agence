import { ImageResponse } from 'next/og'

/**
 * Générateur d'images Open Graph dynamiques (1200×630), à la charte NRJKA.
 * Appelé via /next/og?title=…&subtitle=…&eyebrow=… depuis generateMeta.
 * Chemin sous /next (exclu du middleware i18n, hors catch-all /api de Payload).
 */

export const runtime = 'nodejs'

// Couleurs de marque (fixes ici : Satori ne lit pas les variables CSS).
const NAVY = '#16233F'
const CREAM = '#FAF8F4'
const TERRACOTTA = '#C2703D'
const MUTED = '#9AA6BC'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'NRJKA').trim().slice(0, 90)
  const subtitle = (searchParams.get('subtitle') || '').trim().slice(0, 140)
  const eyebrow = (searchParams.get('eyebrow') || '').trim().slice(0, 32)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: NAVY,
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Haut : signature + éventuel eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 36, fontWeight: 700, color: CREAM }}>
            NRJKA
            <span style={{ color: TERRACOTTA }}>.</span>
          </div>
          {eyebrow ? (
            <div style={{ display: 'flex', fontSize: 22, color: TERRACOTTA, letterSpacing: '0.12em' }}>
              {eyebrow.toUpperCase()}
            </div>
          ) : (
            <div style={{ display: 'flex' }} />
          )}
        </div>

        {/* Milieu : titre + sous-titre */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: 72, height: 5, backgroundColor: TERRACOTTA, marginBottom: 32 }} />
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: CREAM, lineHeight: 1.1 }}>{title}</div>
          {subtitle ? (
            <div style={{ display: 'flex', fontSize: 30, color: '#C9D1DE', marginTop: 26, lineHeight: 1.35 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Bas : domaine */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: MUTED }}>nrjka.com</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
