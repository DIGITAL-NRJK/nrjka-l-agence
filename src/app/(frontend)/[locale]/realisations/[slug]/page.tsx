import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { CaseStudy, Media, Service } from '@/payload-types'
import RichText from '@/components/RichText'
import { LOCALES } from '@/utilities/i18n'
import { getLocalizedPaths, buildLanguageAlternates } from '@/utilities/localizedSlugs'

type Args = { params: Promise<{ locale: string; slug: string }> }

const queryCaseStudy = cache(async (slug: string, locale: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    pagination: false,
    locale: locale as 'fr' | 'en',
  })
  return (res.docs?.[0] as CaseStudy) || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'case-studies',
    limit: 500,
    pagination: false,
    locale: 'all',
    select: { slug: true },
  })
  return (
    res.docs?.flatMap((doc) => {
      const slugByLocale = (doc as unknown as { slug?: Record<string, string> }).slug || {}
      return LOCALES.map((locale) => ({ locale, slug: slugByLocale[locale] })).filter((p) => p.slug)
    }) || []
  )
}

const relName = (rel: unknown): string | undefined =>
  rel && typeof rel === 'object' && 'name' in rel
    ? (rel as { name?: string }).name
    : undefined

const serviceName = (s: number | Service): string | undefined =>
  typeof s === 'object'
    ? ((s as { title?: string; name?: string }).title ?? (s as { name?: string }).name)
    : undefined

export default async function CaseStudyPage({ params }: Args) {
  const { locale, slug } = await params
  const cs = await queryCaseStudy(decodeURIComponent(slug), locale)
  if (!cs) notFound()

  const img = cs.image && typeof cs.image === 'object' ? (cs.image as Media) : null
  const industry = relName(cs.industry)
  const category = relName(cs.category)
  const metrics = cs.metrics || []
  const techs = (cs.technologies || []).map((t) => t.name).filter(Boolean)
  const services = (cs.services_used || []).map(serviceName).filter(Boolean) as string[]
  const testimonials = cs.testimonials || []

  return (
    <article className="container pt-28 pb-24 sm:pt-32">
      <Link
        href={`/${locale}/realisations`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
        {locale === 'en' ? 'All case studies' : 'Toutes les réalisations'}
      </Link>

      {/* En-tête */}
      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          {industry && (
            <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-ink">
              {industry}
            </span>
          )}
          {category && (
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-slate">
              {category}
            </span>
          )}
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          {cs.client_name}
        </h1>
        {cs.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-slate">{cs.excerpt}</p>
        )}
      </header>

      {/* Image principale */}
      {img?.url && (
        <div className="mt-10 overflow-hidden rounded-3xl bg-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt || cs.client_name}
            className="aspect-16/9 w-full object-cover"
          />
        </div>
      )}

      {/* Métriques */}
      {metrics.length > 0 && (
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-surface-soft p-6">
              <div className="font-display text-3xl font-bold text-terracotta-dark">{m.value}</div>
              <div className="mt-1 text-sm text-slate">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Corps */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <div className="max-w-2xl space-y-12">
          {cs.challenge && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-ink">
                {locale === 'en' ? 'The challenge' : 'Le défi'}
              </h2>
              <RichText data={cs.challenge} enableGutter={false} />
            </section>
          )}
          {cs.solution && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-ink">
                {locale === 'en' ? 'Our solution' : 'Notre solution'}
              </h2>
              <RichText data={cs.solution} enableGutter={false} />
            </section>
          )}
          {cs.results && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-ink">
                {locale === 'en' ? 'The results' : 'Les résultats'}
              </h2>
              <RichText data={cs.results} enableGutter={false} />
            </section>
          )}
        </div>

        {/* Aside méta */}
        {(techs.length > 0 || services.length > 0 || cs.duration || cs.team_size) && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-6 rounded-2xl border border-border bg-surface-soft p-6 text-sm">
              {cs.duration && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
                    {locale === 'en' ? 'Duration' : 'Durée'}
                  </div>
                  <div className="mt-1 text-ink">{cs.duration}</div>
                </div>
              )}
              {typeof cs.team_size === 'number' && cs.team_size > 0 && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
                    {locale === 'en' ? 'Team' : 'Équipe'}
                  </div>
                  <div className="mt-1 text-ink">
                    {cs.team_size} {locale === 'en' ? `person${cs.team_size > 1 ? 's' : ''}` : `personne${cs.team_size > 1 ? 's' : ''}`}
                  </div>
                </div>
              )}
              {services.length > 0 && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
                    {locale === 'en' ? 'Services' : 'Services'}
                  </div>
                  <div className="mt-1 text-ink">{services.join(', ')}</div>
                </div>
              )}
              {techs.length > 0 && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
                    {locale === 'en' ? 'Technologies' : 'Technologies'}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {techs.map((t, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-slate"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) =>
            t.quote ? (
              <figure key={i} className="rounded-3xl border border-border bg-surface-soft p-7">
                <blockquote className="text-lg leading-relaxed text-ink">"{t.quote}"</blockquote>
                {(t.author || t.author_role) && (
                  <figcaption className="mt-4 text-sm text-slate">
                    <span className="font-semibold text-ink">{t.author}</span>
                    {t.author_role ? ` — ${t.author_role}` : ''}
                  </figcaption>
                )}
              </figure>
            ) : null,
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl bg-brand px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            {locale === 'en' ? 'A similar project in mind?' : 'Un projet similaire en tête ?'}
          </h2>
          <p className="mt-1 text-white/70">
            {locale === 'en' ? "Let's talk — first call is free." : 'Parlons-en — le premier échange est gratuit.'}
          </p>
        </div>
        <Link
          href={`/${locale}/contact`}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
        >
          {locale === 'en' ? 'Request an audit' : 'Demander un audit'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
        </Link>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const cs = await queryCaseStudy(decodeURIComponent(slug), locale)
  if (!cs) return {}
  const title =
    cs.seo?.metaTitle ||
    `${cs.client_name} — ${locale === 'en' ? 'NRJKA Case Study' : 'Réalisation NRJKA'}`
  const description = cs.seo?.metaDescription || cs.excerpt || undefined
  const localizedPaths = await getLocalizedPaths('case-studies', cs.id, (s) => `/realisations/${s}`)
  return {
    title,
    description,
    alternates: buildLanguageAlternates({ locale, localizedPaths, fallbackPath: `/realisations/${slug}` }),
  }
}
