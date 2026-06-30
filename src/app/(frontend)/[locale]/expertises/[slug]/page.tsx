import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import Image from 'next/image'
import type { Expertise, Service, CaseStudy, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { JsonLd } from '@/components/JsonLd'
import { LOCALES } from '@/utilities/i18n'
import { getServerSideURL } from '@/utilities/getURL'

import { Faq } from '../../../expertises/[slug]/Faq'

type Args = { params: Promise<{ locale: string; slug: string }> }

const queryExpertise = cache(async (slug: string, locale: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'expertises',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 1,
    pagination: false,
    locale: locale as 'fr' | 'en',
  })
  return (res.docs?.[0] as Expertise) || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'expertises',
    where: { published: { equals: true } },
    limit: 100,
    pagination: false,
    select: { slug: true },
  })
  return (
    res.docs?.flatMap(({ slug }) => LOCALES.map((locale) => ({ locale, slug }))) || []
  )
}

export default async function ExpertisePage({ params }: Args) {
  const { locale, slug } = await params
  const e = await queryExpertise(decodeURIComponent(slug), locale)
  if (!e) notFound()

  const benefits = (e.benefits || []).map((b) => b.benefit).filter(Boolean) as string[]
  const steps = e.process_steps || []
  const techs = (e.technologies || []).map((t) => t.name).filter(Boolean) as string[]
  const faqs = e.faqs || []
  const services = ((e.services as { docs?: Service[] } | undefined)?.docs || []).filter(
    (s): s is Service => typeof s === 'object',
  )

  let projects: CaseStudy[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'case-studies',
      where: { expertises: { equals: e.id } },
      sort: '-is_featured',
      limit: 6,
      depth: 1,
      locale: locale as 'fr' | 'en',
    })
    projects = res.docs as CaseStudy[]
  } catch {
    projects = []
  }

  // Fil d'Ariane structuré : Accueil › Expertise.
  const origin = getServerSideURL()
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Home' : 'Accueil', item: `${origin}/${locale}` },
      { '@type': 'ListItem', position: 2, name: e.title, item: `${origin}/${locale}/expertises/${e.slug}` },
    ],
  }

  return (
    <article className="pt-28 pb-24 sm:pt-32">
      <JsonLd data={breadcrumbJsonLd} />
      {/* En-tête */}
      <header className="container">
        <Link
          href={`/${locale}/#expertises`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          {locale === 'en' ? 'Our expertises' : 'Nos expertises'}
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {e.subtitle || (locale === 'en' ? 'Our expertise' : 'Notre expertise')}
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {e.title}
          </h1>
          {e.description && (
            <p className="mt-6 text-lg leading-relaxed text-slate">{e.description}</p>
          )}
          <div className="mt-8">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark"
            >
              {locale === 'en' ? 'Request a free audit' : 'Demander un audit gratuit'}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </Link>
          </div>
        </div>

        {/* Bénéfices */}
        {benefits.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8">
            {benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-2 text-sm font-medium text-ink">
                <Check className="h-4 w-4 text-terracotta" strokeWidth={2.6} />
                {b}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Contenu long */}
      {e.long_description && (
        <div className="container mt-16 max-w-3xl">
          <RichText data={e.long_description} enableGutter={false} />
        </div>
      )}

      {/* Services rattachés */}
      {services.length > 0 && (
        <div className="container mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {locale === 'en' ? 'What we do' : 'Ce que nous faisons'}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-surface-soft p-6">
                <h3 className="font-semibold text-ink">{s.title}</h3>
                {s.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approche */}
      {steps.length > 0 && (
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {locale === 'en' ? 'Our approach' : 'Notre approche'}
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.id || i}>
                <div className="font-display text-4xl font-bold text-ink/15">{`0${i + 1}`}</div>
                <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
                {step.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{step.description}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Technologies */}
      {techs.length > 0 && (
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {locale === 'en' ? 'Tools & technologies' : 'Outils & technologies'}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {techs.map((t, i) => (
              <span
                key={i}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-ink"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projets reliés */}
      {projects.length > 0 && (
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {locale === 'en' ? 'Projects that demonstrate it' : 'Des projets qui en témoignent'}
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-slate">
            {locale === 'en'
              ? 'A few case studies where this expertise made the difference.'
              : 'Quelques réalisations où cette expertise a fait la différence.'}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const img = p.image && typeof p.image === 'object' ? (p.image as Media) : null
              const sector =
                p.industry && typeof p.industry === 'object' && 'name' in p.industry
                  ? (p.industry as { name?: string }).name
                  : undefined
              const metric = p.metrics && p.metrics.length > 0 ? p.metrics[0] : null
              return (
                <Link
                  key={p.id}
                  href={`/${locale}/realisations/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-terracotta/40"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-brand">
                    {img?.url ? (
                      <Image
                        src={img.url}
                        alt={img.alt || p.client_name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-white/30">
                        {p.client_name}
                      </div>
                    )}
                    {sector && (
                      <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                        {sector}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold text-ink">{p.client_name}</h3>
                    {p.excerpt && (
                      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate">
                        {p.excerpt}
                      </p>
                    )}
                    {metric && (
                      <p className="mt-3 text-sm">
                        <span className="font-semibold text-terracotta-dark">{metric.value}</span>{' '}
                        <span className="text-slate">{metric.label}</span>
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="container mt-20 max-w-3xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs
                  .filter((f) => f.question)
                  .map((f) => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: { '@type': 'Answer', text: f.answer },
                  })),
              }),
            }}
          />
          <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">
            {locale === 'en' ? 'Frequently asked questions' : 'Questions fréquentes'}
          </h2>
          <Faq items={faqs} />
        </div>
      )}

      {/* CTA final */}
      <div className="container mt-20">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-brand px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              {locale === 'en' ? 'A project on this scope?' : 'Un projet sur ce périmètre ?'}
            </h2>
            <p className="mt-1 text-white/70">
              {locale === 'en'
                ? 'First call is free and non-binding.'
                : 'Le premier échange est gratuit, et sans engagement.'}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
          >
            {locale === 'en' ? 'Request an audit' : 'Demander un audit'}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2.4}
            />
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const e = await queryExpertise(decodeURIComponent(slug), locale)
  if (!e) return {}
  return {
    title: e.seo?.metaTitle || `${e.title} — ${locale === 'en' ? 'NRJKA Expertise' : 'Expertise NRJKA'}`,
    description: e.seo?.metaDescription || e.description || undefined,
    alternates: {
      languages: {
        fr: `/fr/expertises/${slug}`,
        en: `/en/expertises/${slug}`,
      },
    },
  }
}
