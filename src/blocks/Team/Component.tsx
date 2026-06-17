import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { bgStyle, colorStyle, titleClass, textClass, type Appearance } from '@/utilities/appearance'

type Member = {
  photo?: MediaType | string | number | null
  name?: string | null
  role?: string | null
  id?: string | null
}

export type TeamProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  members?: Member[] | null
  appearance?: Appearance | null
}

const initials = (name?: string | null) =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

export const TeamBlock: React.FC<TeamProps> = ({
  eyebrow,
  title,
  intro,
  members,
  appearance,
}) => {
  const a = appearance || {}
  const list = (members || []).filter((m) => m?.name)
  if (list.length === 0) return null

  return (
    <section className="container" style={bgStyle(a.background)}>
      <div className="max-w-2xl">
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

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((member, i) => {
          const hasPhoto = member.photo && typeof member.photo === 'object'
          return (
            <div key={i}>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand">
                {hasPhoto ? (
                  <Media
                    resource={member.photo}
                    fill
                    className="absolute inset-0"
                    imgClassName="object-cover"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.10]"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-white/80">
                      {initials(member.name)}
                    </span>
                  </>
                )}
              </div>
              {member.name && (
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                  {member.name}
                </h3>
              )}
              {member.role && <p className="mt-0.5 text-sm text-slate">{member.role}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
