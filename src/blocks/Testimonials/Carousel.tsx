'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselItem = {
  id: string
  content: string
  authorName: string
  role?: string | null
  rating?: number | null
  avatarSrc?: string | null
}

const initials = (name?: string | null) =>
  !name
    ? '•'
    : name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')

export const TestimonialsCarousel: React.FC<{ items: CarouselItem[] }> = ({ items }) => {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-12">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <figure
            key={t.id}
            className="flex shrink-0 basis-full snap-start flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/25 hover:bg-white/10 sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
          >
            {t.rating ? (
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-terracotta text-terracotta" strokeWidth={0} />
                ))}
              </div>
            ) : (
              <Quote className="mb-4 h-6 w-6 text-terracotta/60" strokeWidth={2} />
            )}
            <blockquote className="flex-1 break-words leading-relaxed text-white/90">
              {t.content}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.avatarSrc ? (
                <Image
                  src={t.avatarSrc}
                  alt={t.authorName}
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-terracotta">
                  {initials(t.authorName)}
                </span>
              )}
              <div>
                <div className="font-semibold text-white">{t.authorName}</div>
                {t.role && <div className="text-sm text-white/70">{t.role}</div>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Flèches — affichées seulement s'il y a plus de 3 témoignages */}
      {items.length > 3 && (
        <div className="mt-6 flex justify-center gap-3 lg:justify-end">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Témoignages précédents"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Témoignages suivants"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  )
}
