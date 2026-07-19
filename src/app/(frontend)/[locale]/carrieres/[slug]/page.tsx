import type { Metadata } from 'next'
import React, { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, MapPin } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { JobOffer } from '@/payload-types'
import RichText from '@/components/RichText'
import { LOCALES } from '@/utilities/i18n'
import { JobApplicationForm } from '@/components/JobApplicationForm'
import { localizedLanguages } from '@/utilities/languages'

export const revalidate = 300

type Args = { params: Promise<{ locale: string; slug: string }> }

const CONTRACT: Record<string, { fr: string; en: string }> = {
  cdi: { fr: 'CDI', en: 'Permanent' },
  cdd: { fr: 'CDD', en: 'Fixed-term' },
  freelance: { fr: 'Freelance', en: 'Freelance' },
  internship: { fr: 'Stage', en: 'Internship' },
  apprenticeship: { fr: 'Alternance', en: 'Work-study' },
}

const queryOffer = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'job-offers',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 0,
    pagination: false,
  })
  return (res.docs?.[0] as JobOffer) || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'job-offers',
    where: { published: { equals: true } },
    limit: 500,
    pagination: false,
    select: { slug: true },
  })
  return (
    res.docs?.flatMap((doc) =>
      LOCALES.map((locale) => ({ locale, slug: (doc as { slug?: string }).slug })).filter(
        (p) => p.slug,
      ),
    ) || []
  )
}

// Localise une liste `[{ item, item_en }]` selon la langue.
const pickList = (
  arr: { item?: string | null; item_en?: string | null }[] | null | undefined,
  en: boolean,
): string[] => (arr || []).map((r) => (en && r.item_en) || r.item || '').filter(Boolean)

export default async function JobOfferPage({ params }: Args) {
  const { locale, slug } = await params
  const en = locale === 'en'
  const o = await queryOffer(decodeURIComponent(slug))
  if (!o) notFound()

  // Textes pilotables depuis l'admin (global « Carrières (textes) »), avec repli.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let g: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    g = await (payload as any)
      .findGlobal({ slug: 'careers-settings', locale, depth: 0 })
      .catch(() => null)
  } catch {
    g = null
  }
  const d = g?.detail || {}
  const formLabels = g?.form || {}

  const title = (en && o.title_en) || o.title
  const description = (en && o.description_en) || o.description
  const contract = CONTRACT[o.contract_type]
  const responsibilities = pickList(o.responsibilities, en)
  const requirements = pickList(o.requirements, en)
  const benefits = pickList(o.benefits, en)

  const List = ({ heading, items }: { heading: string; items: string[] }) =>
    items.length > 0 ? (
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-ink">{heading}</h2>
        <ul className="space-y-2.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-slate">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" strokeWidth={2.4} />
              <span className="leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      </section>
    ) : null

  return (
    <article className="container pt-16 pb-24 sm:pt-20">
      <Link
        href={`/${locale}/carrieres`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
        {en ? 'All roles' : 'Toutes les offres'}
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate">
          {contract && (
            <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-ink">
              {en ? contract.en : contract.fr}
            </span>
          )}
          {o.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" strokeWidth={2} />
              {o.location}
            </span>
          )}
          {o.salary_range && <span>{o.salary_range}</span>}
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="max-w-2xl space-y-12">
          {description && (
            <div className="prose-nrjka">
              <RichText data={description} enableGutter={false} />
            </div>
          )}
          <List
            heading={d.responsibilities || (en ? 'Responsibilities' : 'Responsabilités')}
            items={responsibilities}
          />
          <List
            heading={d.requirements || (en ? 'Requirements' : 'Prérequis')}
            items={requirements}
          />
          <List heading={d.perks || (en ? 'Perks' : 'Avantages')} items={benefits} />
        </div>

        {/* Formulaire de candidature */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <JobApplicationForm
            jobOfferId={String(o.id)}
            jobTitle={title}
            locale={locale}
            labels={formLabels}
          />
        </aside>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const en = locale === 'en'
  const o = await queryOffer(decodeURIComponent(slug))
  if (!o) return {}
  const title = (en && o.title_en) || o.title
  return {
    title: o.seo?.metaTitle || `${title} — NRJKA`,
    description: o.seo?.metaDescription || undefined,
    alternates: {
      languages: await localizedLanguages({
        fr: `/fr/carrieres/${o.slug}`,
        en: `/en/carrieres/${o.slug}`,
      }),
    },
  }
}
