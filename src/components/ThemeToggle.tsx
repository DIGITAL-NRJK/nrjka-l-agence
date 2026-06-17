'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/providers/Theme'

/**
 * Bascule clair / sombre. S'appuie sur le ThemeProvider (data-theme + localStorage).
 * Rendu neutre (lune) avant le montage pour éviter tout décalage d'hydratation.
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = mounted && theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-slate transition-colors hover:bg-surface-soft hover:text-ink ${className || ''}`}
    >
      {isDark ? <Sun className="h-5 w-5" strokeWidth={2} /> : <Moon className="h-5 w-5" strokeWidth={2} />}
    </button>
  )
}
