import React from 'react'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Star, Quote } from 'lucide-react'

import type {
  TestimonialsBlock as TestimonialsBlockProps,
  Testimonial,
  Media,
} from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'
import { TestimonialsCarousel, type CarouselItem } from './Carousel'

function initials(name?: string | null) {
  if (!name) return '•'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

export const TestimonialsBlock = async (props: TestimonialsBlockProps) => {
  const { eyebrow, title, intro, limit } = props
  const a = props.appearance || {}

  let items: Testimonial[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'testimonials',
      sort: 'order',
      limit: limit || 12,
      depth: 1,
    })
    items = res.docs
  } catch {
    items = []
  }

  if (items.length === 0) return null

  const single = items.length === 1 ? items[0] : null
  const singleAvatar =
    single?.avatar && typeof single.avatar === 'object' ? (single.avatar as Media) : null
  const singleAvatarSrc = singleAvatar?.url || single?.avatar_url || null
  const singleRole = [single?.author_role, single?.company].filter(Boolean).join(' · ')

  return (
    <section className="container">
      <div
        className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 shadow-soft sm:px-10 sm:py-16 lg:px-14"
        style={bgStyle(a.background)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative">
          <div className="mx-auto max-w-2xl text-center">
            {eyebrow && (
              <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                <span className="h-px w-8 bg-terracotta" />
                {eyebrow}
                <span className="h-px w-8 bg-terracotta" />
              </span>
            )}
            {title && (
              <h2
                className={`${titleClass(a, 'text-4xl sm:text-5xl')} font-bold leading-tight tracking-tight text-white`}
                style={colorStyle(a.titleColor)}
              >
                {title}
              </h2>
            )}
            {intro && (
              <p
                className={`${textClass(a, 'text-lg')} mt-4 leading-relaxed text-white/70`}
                style={colorStyle(a.textColor)}
              >
                {intro}
              </p>
            )}
          </div>

          {single ? (
            <figure className="mx-auto mt-12 max-w-3xl text-center">
              {single.rating ? (
                <div className="mb-6 flex justify-center gap-1">
                  {Array.from({ length: single.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-terracotta text-terracotta"
                      strokeWidth={0}
                    />
                  ))}
                </div>
              ) : (
                <Quote className="mx-auto mb-6 h-8 w-8 text-terracotta/60" strokeWidth={2} />
              )}
              <blockquote className="break-words font-display text-2xl font-medium leading-snug text-white sm:text-3xl">
                «&nbsp;{single.content}&nbsp;»
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                {singleAvatarSrc ? (
                  <Image
                    src={singleAvatarSrc}
                    alt={single.author_name}
                    width={44}
                    height={44}
                    unoptimized
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-terracotta">
                    {initials(single.author_name)}
                  </span>
                )}
                <div className="text-left">
                  <div className="font-semibold text-white">{single.author_name}</div>
                  {singleRole && <div className="text-sm text-white/70">{singleRole}</div>}
                </div>
              </figcaption>
            </figure>
          ) : (
            <TestimonialsCarousel
              items={items.map((t): CarouselItem => {
                const avatar = t.avatar && typeof t.avatar === 'object' ? (t.avatar as Media) : null
                return {
                  id: String(t.id),
                  content: t.content,
                  authorName: t.author_name,
                  role: [t.author_role, t.company].filter(Boolean).join(' · ') || null,
                  rating: t.rating ?? null,
                  avatarSrc: avatar?.url || t.avatar_url || null,
                }
              })}
            />
          )}
        </div>
      </div>
    </section>
  )
}
