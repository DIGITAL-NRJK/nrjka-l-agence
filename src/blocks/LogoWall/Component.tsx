import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { bgStyle, colorStyle, titleClass, textClass, type Appearance } from '@/utilities/appearance'
import { localizeHref } from '@/utilities/localizeHref'

type LogoItem = {
  logo?: MediaType | string | number | null
  name?: string | null
  href?: string | null
  id?: string | null
}

export type LogoWallProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  logos?: LogoItem[] | null
  grayscale?: boolean | null
  appearance?: Appearance | null
  locale?: string
}

const isExternal = (href: string) => /^https?:\/\//.test(href) || href.startsWith('//')

export const LogoWallBlock: React.FC<LogoWallProps> = ({
  eyebrow,
  title,
  intro,
  logos,
  grayscale = true,
  appearance,
  locale = 'fr',
}) => {
  const a = appearance || {}

  const list = (logos || [])
    .map((item) => {
      const media = item?.logo && typeof item.logo === 'object' ? (item.logo as MediaType) : null
      return { url: media?.url || '', alt: media?.alt || item?.name || '', name: item?.name || '', href: item?.href || '' }
    })
    .filter((item) => item.url)

  if (list.length === 0) return null

  const hasHeader = Boolean(eyebrow || title || intro)
  const imgClass = `max-h-10 w-auto max-w-[140px] object-contain transition-all duration-300 ${
    grayscale
      ? 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'
      : 'opacity-80 group-hover:opacity-100'
  }`

  return (
    <section className="container" style={bgStyle(a.background)}>
      {hasHeader && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
              <span className="h-px w-8 bg-terracotta" />
              {eyebrow}
            </span>
          )}
          {title && (
            <h2
              className={`${titleClass(a, 'text-3xl sm:text-4xl')} font-display font-bold leading-tight tracking-tight text-ink`}
              style={colorStyle(a.titleColor)}
            >
              {title}
            </h2>
          )}
          {intro && (
            <p
              className={`${textClass(a, 'text-lg')} mt-5 leading-relaxed text-slate`}
              style={colorStyle(a.textColor)}
            >
              {intro}
            </p>
          )}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
        {list.map((item, i) => {
          const inner = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.alt}
              className={imgClass}
              loading="lazy"
              decoding="async"
            />
          )
          const href = item.href ? localizeHref(item.href, locale) : ''
          const external = item.href ? isExternal(item.href) : false
          return (
            <li key={i} className="flex items-center justify-center bg-card">
              {href ? (
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="group flex h-full w-full items-center justify-center px-6 py-8"
                  aria-label={item.name || undefined}
                  title={item.name || undefined}
                >
                  {inner}
                </a>
              ) : (
                <span className="group flex h-full w-full items-center justify-center px-6 py-8" title={item.name || undefined}>
                  {inner}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
