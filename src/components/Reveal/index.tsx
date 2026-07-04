'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Révélation douce à l'entrée dans le viewport (microinteraction).
 *
 * Robuste par conception :
 * - SSR / sans JS : aucun attribut → contenu pleinement visible (pas de contenu caché).
 * - `prefers-reduced-motion` : aucune animation.
 * - Sans flash : on ne masque QUE les éléments situés sous la ligne de flottaison
 *   (donc hors écran) ; ceux déjà visibles au chargement ne sont jamais animés.
 *
 * Le style est porté par les sélecteurs [data-reveal] dans globals.css.
 */
export const Reveal: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    // Déjà visible au chargement → on laisse tel quel (pas d'animation, pas de flash).
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    el.setAttribute('data-reveal', 'hidden')
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-reveal', 'shown')
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default Reveal
