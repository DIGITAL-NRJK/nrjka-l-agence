import React from 'react'
import { ArrowUpRight, ShoppingCart, FileText, ShieldCheck } from 'lucide-react'

import type { LabBlock as LabBlockProps, Media } from '@/payload-types'

const sceneCss = `
@keyframes sb-flow{0%{left:2px;opacity:0}15%{opacity:1}85%{opacity:1}100%{left:calc(100% - 10px);opacity:0}}
@keyframes sb-grow{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
@keyframes sb-fill{0%,100%{opacity:.2}45%,70%{opacity:1}}
@keyframes sb-blink{0%,60%,100%{opacity:.25}30%{opacity:1}}
@keyframes sb-pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes sb-ping{0%{box-shadow:0 0 0 0 rgba(22,163,74,.5)}100%{box-shadow:0 0 0 7px rgba(22,163,74,0)}}
.sb-flow{animation:sb-flow 2.4s linear infinite}
.sb-grow{animation:sb-grow 1.8s ease-in-out infinite;transform-origin:bottom}
.sb-fill{animation:sb-fill 2.6s ease-in-out infinite}
.sb-blink{animation:sb-blink 1.4s infinite}
.sb-pop{animation:sb-pop .6s ease-out}
.sb-ping{animation:sb-ping 1.6s infinite}
@media (prefers-reduced-motion:reduce){.sb-flow,.sb-grow,.sb-fill,.sb-blink,.sb-pop,.sb-ping{animation:none}}
`

function Scene({ type }: { type?: string | null }) {
  if (type === 'dashboard') {
    return (
      <div className="flex h-[54px] items-end gap-[7px]">
        {[0, 0.2, 0.4, 0.6].map((d, k) => (
          <span
            key={k}
            className="sb-grow w-[11px] rounded-t bg-terracotta"
            style={{
              height: 54,
              animationDelay: `${d}s`,
              background: k % 2 ? '#6B7A99' : undefined,
            }}
          />
        ))}
      </div>
    )
  }
  if (type === 'calendar') {
    return (
      <div className="grid grid-cols-4 gap-[5px]">
        {Array.from({ length: 8 }).map((_, k) => (
          <span
            key={k}
            className={`block h-[13px] w-4 rounded-[3px] ${k === 2 ? 'sb-fill bg-terracotta' : 'bg-white/10'}`}
          />
        ))}
      </div>
    )
  }
  if (type === 'chat') {
    return (
      <div className="flex w-[150px] flex-col gap-1.5">
        <span className="self-start rounded-lg bg-white/15 px-2.5 py-1.5 text-[10px] text-white">
          Vous livrez en IDF ?
        </span>
        <span className="sb-blink self-start rounded-lg bg-white/15 px-3 py-2 text-[10px] tracking-widest text-white">
          ...
        </span>
        <span className="sb-pop self-end rounded-lg bg-terracotta px-2.5 py-1.5 text-[10px] font-medium text-brand">
          Oui, je vous oriente
        </span>
      </div>
    )
  }
  if (type === 'form') {
    return (
      <div className="w-[120px] space-y-2">
        <span className="block h-2.5 w-full rounded bg-white/15" />
        <span className="sb-fill block h-2.5 w-3/4 rounded bg-terracotta" />
        <span className="block h-2.5 w-full rounded bg-white/15" />
      </div>
    )
  }
  if (type === 'content') {
    return (
      <div className="w-[130px] space-y-2">
        <span className="block h-2.5 w-1/2 rounded bg-terracotta/70" />
        <span className="block h-2 w-full rounded bg-white/15" />
        <span className="sb-fill block h-2 w-5/6 rounded bg-white/15" />
        <span className="block h-2 w-2/3 rounded bg-white/15" />
      </div>
    )
  }
  if (type === 'security') {
    return (
      <div className="relative flex items-center justify-center">
        <span className="sb-ping absolute h-12 w-12 rounded-full border border-terracotta/30" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-terracotta">
          <ShieldCheck className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center">
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-white/10 text-terracotta">
        <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="relative mx-2 h-[2px] w-16 bg-white/15">
        <span className="sb-flow absolute -top-[3px] left-0 h-2 w-2 rounded-full bg-terracotta" />
      </span>
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-white/10 text-terracotta">
        <FileText className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
    </div>
  )
}

export const LabBlock: React.FC<LabBlockProps> = ({
  eyebrow,
  title,
  intro,
  demos,
  ctaLabel,
  ctaHref,
}) => {
  const list = demos || []

  return (
    <section className="container">
      <style dangerouslySetInnerHTML={{ __html: sceneCss }} />

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
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((demo, i) => {
            const stack = (demo.stack || []).map((s) => s.label).filter(Boolean)
            const isLive = demo.status === 'live'
            const clickable = Boolean(isLive && demo.url)
            const media =
              demo.media && typeof demo.media === 'object' ? (demo.media as Media) : null
            const isVideo = Boolean(media?.mimeType?.startsWith('video'))
            const cardClass = [
              'group flex h-full flex-col overflow-hidden rounded-2xl border transition-all',
              isLive
                ? 'border-border bg-card hover:-translate-y-1 hover:border-terracotta/40'
                : 'border-dashed border-border bg-surface-soft',
            ].join(' ')
            const inner = (
              <>
                <div className="relative h-32 overflow-hidden bg-brand">
                  <div className="flex h-6 items-center gap-1.5 border-b border-white/10 px-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 top-6 flex items-center justify-center">
                    {media ? (
                      isVideo ? (
                        <video
                          className="h-full w-full object-cover"
                          src={media.url || ''}
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          className="h-full w-full object-cover"
                          src={media.url || ''}
                          alt={media.alt || demo.title || ''}
                        />
                      )
                    ) : (
                      <Scene type={demo.previewType} />
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2.5 flex flex-wrap items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-emerald-600">
                        <span className="sb-ping h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Live
                      </span>
                    ) : (
                      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-slate">
                        Bientôt
                      </span>
                    )}
                    {demo.sector && (
                      <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 text-[0.7rem] font-medium text-[#bf5e1f]">
                        {demo.sector}
                      </span>
                    )}
                  </div>
                  {stack.length > 0 && (
                    <p className="font-mono text-sm text-[#bf5e1f]">{stack.join(' × ')}</p>
                  )}
                  <h3 className="mt-1.5 font-semibold text-ink">{demo.title}</h3>
                  {demo.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate">{demo.description}</p>
                  )}
                  {clickable && (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-ink">
                      Voir la démo
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  )}
                </div>
              </>
            )
            return clickable ? (
              <a
                key={i}
                href={demo.url as string}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {inner}
              </a>
            ) : (
              <div key={i} className={cardClass}>
                {inner}
              </div>
            )
          })}
        </div>
      )}

      {ctaLabel && (
        <div className="mt-10">
          <a
            href={ctaHref || '#'}
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-brand-foreground transition-colors hover:bg-brand-2"
          >
            {ctaLabel}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </a>
        </div>
      )}
    </section>
  )
}
