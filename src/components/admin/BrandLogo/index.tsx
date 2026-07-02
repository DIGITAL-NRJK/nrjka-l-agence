import React from 'react'

// Identité NRJKA pour l'admin Payload (remplace le logo Payload).
// - Logo : page de connexion (grand format, monogramme + wordmark)
// - Icon : barre de navigation de l'admin (petit format)
// Enregistrés dans payload.config.ts (admin.components.graphics) + importMap.js (entrée manuelle).

const Monogram: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="14" fill="#1f2a44" />
    <path d="M17 46V18h6.4l14.2 18.6V18H44v28h-6.4L23.4 27.4V46H17z" fill="#ffffff" />
    <circle cx="47.5" cy="43.5" r="4.5" fill="#f4a261" />
  </svg>
)

export const Icon: React.FC = () => <Monogram size={26} />

export const Logo: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '14px',
    }}
  >
    <Monogram size={64} />
    <span
      style={{
        fontSize: '28px',
        fontWeight: 700,
        letterSpacing: '0.04em',
      }}
    >
      NRJKA<span style={{ color: '#f4a261' }}>.</span>
    </span>
  </div>
)
