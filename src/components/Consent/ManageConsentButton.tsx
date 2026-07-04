'use client'

import React from 'react'
import { OPEN_CONSENT_EVENT } from './ConsentManager'

/**
 * Lien « Gérer mes préférences » à placer dans le footer.
 * Rouvre le bandeau de consentement (retrait/modification à tout moment = exigence RGPD).
 */
export const ManageConsentButton: React.FC<{ locale: string; className?: string }> = ({
  locale,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={className ?? 'transition-colors hover:text-white/80'}
    >
      {locale === 'en' ? 'Cookie preferences' : 'Gérer mes préférences'}
    </button>
  )
}

export default ManageConsentButton
