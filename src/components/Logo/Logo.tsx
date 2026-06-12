import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = ({ className }: Props) => {
  return (
    <span
      className={clsx('font-display text-2xl font-bold leading-none tracking-tight', className)}
    >
      NRJKA<span className="text-terracotta">.</span>
    </span>
  )
}
