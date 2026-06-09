import React from 'react'
import { Check } from 'lucide-react'

import type { CommitmentsBlock as CommitmentsBlockProps } from '@/payload-types'

export const CommitmentsBlock: React.FC<CommitmentsBlockProps> = ({
  eyebrow,
  title,
  intro,
  commitments,
}) => {
  const list = commitments || []

  return (
    <section className="container">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </span>
        )}
        {title && (
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
        )}
        {intro && <p className="mt-5 text-lg leading-relaxed text-slate">{intro}</p>}
      </div>

      {list.length > 0 && (
        <div className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {list.map((item, i) => (
            <div key={i} className="flex gap-4 border-t border-border pt-7">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-terracotta/40 text-terracotta">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-slate">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
