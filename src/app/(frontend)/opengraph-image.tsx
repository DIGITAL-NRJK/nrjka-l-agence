import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'NRJKA Digital — Agence web & transformation digitale'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1f2a44',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grille de fond */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Halo terracotta */}
        <div
          style={{
            position: 'absolute',
            right: -80,
            top: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(244,162,97,0.18)',
            filter: 'blur(80px)',
          }}
        />
        {/* Halo bas gauche */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            bottom: -40,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(45,62,95,0.8)',
            filter: 'blur(60px)',
          }}
        />

        {/* Contenu */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Badge Architecture D4™ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              fontFamily: 'sans-serif',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: 32, height: 2, background: '#f4a261' }} />
            Architecture D4™
          </div>

          {/* Titre NRJKA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 4,
              fontSize: 96,
              fontFamily: 'sans-serif',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            NRJKA
            <span style={{ color: '#f4a261', fontSize: 96 }}>.</span>
          </div>

          {/* Sous-titre */}
          <div
            style={{
              fontSize: 26,
              fontFamily: 'sans-serif',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.4,
              maxWidth: 640,
            }}
          >
            Agence web & transformation digitale
          </div>

          {/* Séparateur + URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <div style={{ width: 48, height: 2, background: '#f4a261', opacity: 0.6 }} />
            <span
              style={{
                fontSize: 18,
                fontFamily: 'sans-serif',
                color: '#f4a261',
                letterSpacing: '0.04em',
              }}
            >
              nrjka.com
            </span>
          </div>
        </div>

        {/* D4 panel (coin bas droit) */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            display: 'flex',
            gap: 10,
          }}
        >
          {['Diagnostic', 'Design', 'Développement', 'Durabilité'].map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '10px 16px',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                  color: '#f4a261',
                  letterSpacing: '0.08em',
                }}
              >
                {`0${i + 1}`}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'sans-serif',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                }}
              >
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
