import type { CSSProperties } from 'react'

export type Appearance = {
  titleSize?: string | null
  textSize?: string | null
  titleColor?: string | null
  textColor?: string | null
  background?: string | null
}

const titleSizeClasses: Record<string, string> = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
  xl: 'text-5xl sm:text-6xl',
}

const textSizeClasses: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
}

export function titleClass(a: Appearance | null | undefined, fallback: string): string {
  return (a?.titleSize && titleSizeClasses[a.titleSize]) || fallback
}

export function textClass(a: Appearance | null | undefined, fallback = ''): string {
  return (a?.textSize && textSizeClasses[a.textSize]) || fallback
}

export function colorStyle(color?: string | null): CSSProperties | undefined {
  return color ? { color } : undefined
}

export function bgStyle(color?: string | null): CSSProperties | undefined {
  return color ? { backgroundColor: color } : undefined
}
