import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import Image from 'next/image'
import type { Service, Expertise, CaseStudy, Post, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { Accordion } from '@/blocks/Faq/Accordion'

type Args = { params: Promise<{ slug: string }> }

const queryService = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 2,
    pagination: false,
  })
  return (res.docs?.[0] as Service) || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'services',
    where: { published: { equals: true } },
    limit: 500,
    pagination: false,
    select: { slug: true },
  })
  return res.docs?.map(({ slug }) => ({ slug })) || []
}

export default async function ServicePage({ params }: Args) {
  const { slug } = await params
  const s = await queryService(decodeURIComponent(slug))
  if (!s) notFound()

  const pole = s.pole && typeof s.pole === 'object' ? (s.pole as Expertise) : null
  const benefits = (s.benefits || []).map((b) => b.benefit).filter(Boolean) as string[]
  const besoins = (s.besoins || []).map((b) => b.label).filter(Boolean) as string[]
  const steps = s.process_steps || []
  const techs = (s.technologies || []).map((t) => t.name).filter(Boolean) as string[]
  const faqs = s.faqs || []
  const projects = ((s.case_studies as (number | CaseStudy)[] | undefined) || []).filter(
    (c): c is CaseStudy => typeof c === 'object',
  )
  const articles = ((s.related_articles as (number | Post)[] | undefined) || []).filter(
    (a): a is Post => typeof a === 'object',
  )

  return (
    <article className="pt-28 pb-24 sm:pt-32">
      {/* En-tête */}
      <header className="container">
        <Link
          href={pole ? `/expertises/${pole.slug}` : '/#expertises'}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          {pole ? pole.title : 'Nos expertises'}
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {pole ? pole.title : 'Service'}
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {s.title}
          </h1>
          {s.description && (
            <p className="mt-6 text-lg leading-relaxed text-slate">{s.description}</p>
          )}
          <div className="mt-8">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark"
            >
              Demander un audit gratuit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu (Pourquoi · Notre approche · Partenariat) */}
      {s.long_description && (
        <div className="container mt-16 max-w-3xl">
          <RichText data={s.long_description} enableGutter={false} />
        </div>
      )}

      {/* Objectifs visés */}
      {benefits.length > 0 && (
        <div className="container mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Objectifs visés</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface-soft p-5"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" strokeWidth={2.4} />
                <span className="text-ink">{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Besoins couverts */}
      {besoins.length > 0 && (
        <div className="container mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Ce que ça couvre</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {besoins.map((b, i) => (
              <span
                key={i}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-ink"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notre approche */}
      {steps.length > 0 && (
        <div className="container mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Notre approche</h2>
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
        <div className="container mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Outils & technologies</h2>
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

      {/* Projets liés */}
      {projects.length > 0 && (
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Projets liés</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const img = p.image && typeof p.image === 'object' ? (p.image as Media) : null
              return (
                <Link
                  key={p.id}
                  href={`/realisations/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-terracotta/40"
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
                      <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-white/30">
                        {p.client_name}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-ink">{p.client_name}</h3>
                    {p.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate">
                        {p.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Pour approfondir (articles) */}
      {articles.length > 0 && (
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Pour approfondir</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/posts/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface-soft p-6 transition-all hover:-translate-y-1 hover:border-terracotta/40"
              >
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-terracotta-dark">
                  Article
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-terracotta-dark">
                  {a.title}
                </h3>
                {a.meta?.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">
                    {a.meta.description}
                  </p>
                )}
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                  Lire l’article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                </span>
              </Link>
            ))}
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
            Questions fréquentes
          </h2>
          <Accordion items={faqs} />
        </div>
      )}

      {/* CTA final */}
      <div className="container mt-20">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-brand px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Parlons de votre besoin
            </h2>
            <p className="mt-1 text-white/70">Le premier échange est gratuit, et sans engagement.</p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
          >
            Demander un audit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const s = await queryService(decodeURIComponent(slug))
  if (!s) return {}
  return {
    title: s.seo?.metaTitle || `${s.title} — NRJKA`,
    description: s.seo?.metaDescription || s.description || undefined,
  }
}
