'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'

export type FaqItem = { question?: string | null; answer?: string | null; id?: string | null }

export const Faq: React.FC<{ items: FaqItem[] }> = ({ items }) => {
  const [open, setOpen] = useState<number | null>(0)
  const list = items.filter((i) => i.question)
  if (list.length === 0) return null

  return (
    <div className="divide-y divide-border border-y border-border">
      {list.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.id || i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="font-display text-lg font-semibold text-ink">{item.question}</span>
              <Plus
                className={`h-5 w-5 shrink-0 text-terracotta transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : ''
                }`}
                strokeWidth={2.2}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl whitespace-pre-line leading-relaxed text-slate">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
