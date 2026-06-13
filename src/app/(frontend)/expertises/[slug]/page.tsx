import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Service, Media } from '@/payload-types'
import RichText from '@/components/RichText'

import { Faq } from './Faq'

type Args = { params: Promise<{ slug: string }> }

const queryService = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 1,
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

export default async function ExpertisePage({ params }: Args) {
  const { slug } = await params
  const s = await queryService(decodeURIComponent(slug))
  if (!s) notFound()

  const benefits = (s.benefits || []).map((b) => b.benefit).filter(Boolean) as string[]
  const features = (s.features || []).map((f) => f.feature).filter(Boolean) as string[]
  const steps = s.process_steps || []
  const techs = (s.technologies || []).map((t) => t.name).filter(Boolean) as string[]
  const faqs = s.faqs || []
  const eyebrow = 'Notre expertise'

  return (
    <article className="pt-28 pb-24 sm:pt-32">
      {/* En-tête */}
      <header className="container">
        <Link
          href="/#expertises"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          Nos expertises
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
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
      {s.long_description && (
        <div className="container mt-16 max-w-3xl">
          <RichText data={s.long_description} enableGutter={false} />
        </div>
      )}

      {/* Prestations */}
      {features.length > 0 && (
        <div className="container mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Ce que nous faisons
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface-soft p-5"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" strokeWidth={2.4} />
                <span className="text-ink">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approche */}
      {steps.length > 0 && (
        <div className="container mt-20">
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
        <div className="container mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Outils & technologies
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

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="container mt-20 max-w-3xl">
          <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">
            Questions fréquentes
          </h2>
          <Faq items={faqs} />
        </div>
      )}

      {/* CTA final */}
      <div className="container mt-20">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-brand px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Un projet sur ce périmètre ?
            </h2>
            <p className="mt-1 text-white/70">Le premier échange est gratuit, et sans engagement.</p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
          >
            Demander un audit
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
  const { slug } = await params
  const s = await queryService(decodeURIComponent(slug))
  if (!s) return {}
  return {
    title: s.seo?.metaTitle || `${s.title} — NRJKA`,
    description: s.seo?.metaDescription || s.description || undefined,
  }
}
