import React from 'react'

// Identité NRJKA pour l'admin Payload (remplace le logo Payload).
// - Logo : page de connexion (grand format, monogramme + wordmark)
// - Icon : barre de navigation de l'admin (petit format)
// Enregistrés dans payload.config.ts (admin.components.graphics) + importMap.js (entrée manuelle).

// Nœud de lignée : entrelacs continu (liens familiaux indissociables) + 5 nœuds
// (la fratrie), le nœud haut en terracotta — rappel du point du wordmark « NRJKA. ».
const Monogram: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="14" fill="#1f2a44" />
    <g transform="translate(32,33)" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round">
      <path d="M-19,0 L0,-19 L19,0 L0,19 Z" />
      <path d="M-9.5,-9.5 L9.5,-9.5 L9.5,9.5 L-9.5,9.5 Z" />
    </g>
    <circle cx="32" cy="14" r="4.4" fill="#f4a261" />
    <circle cx="51" cy="33" r="3.9" fill="#ffffff" />
    <circle cx="32" cy="52" r="3.9" fill="#ffffff" />
    <circle cx="13" cy="33" r="3.9" fill="#ffffff" />
    <circle cx="32" cy="33" r="3.4" fill="#ffffff" />
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
