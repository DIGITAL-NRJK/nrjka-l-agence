import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { JobOffer } from '@/payload-types'
import { localizedLanguages } from '@/utilities/languages'

// Page recrutement (liste des offres publiées). Non ajoutée au menu pour l'instant.
// Textes pilotables depuis l'admin (global « Carrières (textes) »), avec repli bilingue.
export const revalidate = 300

type Args = { params: Promise<{ locale: string }> }

export const CONTRACT_LABELS: Record<string, { fr: string; en: string }> = {
  cdi: { fr: 'CDI', en: 'Permanent' },
  cdd: { fr: 'CDD', en: 'Fixed-term' },
  freelance: { fr: 'Freelance', en: 'Freelance' },
  internship: { fr: 'Stage', en: 'Internship' },
  apprenticeship: { fr: 'Alternance', en: 'Work-study' },
}

export default async function CareersPage({ params }: Args) {
  const { locale } = await params
  const en = locale === 'en'

  let offers: JobOffer[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let s: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    const [res, settings] = await Promise.all([
      payload.find({
        collection: 'job-offers',
        where: { published: { equals: true } },
        sort: '-createdAt',
        limit: 100,
        depth: 0,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload as any)
        .findGlobal({ slug: 'careers-settings', locale, depth: 0 })
        .catch(() => null),
    ])
    offers = res.docs as JobOffer[]
    s = settings?.list || null
  } catch {
    offers = []
  }

  const eyebrow = s?.eyebrow || (en ? 'Careers' : 'Carrières')
  const title = s?.title || (en ? 'Build with us' : 'Construisons ensemble')
  const intro =
    s?.intro ||
    (en
      ? 'We’re building a demanding, human-first digital agency. Explore our open roles — and if none fits, send us a spontaneous application.'
      : 'Nous bâtissons une agence digitale exigeante et humaine. Découvrez nos postes ouverts — et si rien ne correspond, envoyez-nous une candidature spontanée.')
  const emptyText = s?.emptyText || (en ? 'No open position right now.' : 'Pas de poste ouvert pour le moment.')
  const spontaneousCta =
    s?.spontaneousCta || (en ? 'Send a spontaneous application' : 'Candidature spontanée')

  return (
    <div className="container pt-16 pb-24 sm:pt-20">
      <div className="max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {eyebrow}
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate">{intro}</p>
      </div>

      {offers.length > 0 ? (
        <>
          <ul className="mt-12 grid gap-4">
            {offers.map((o) => {
              const oTitle = (en && o.title_en) || o.title
              const contract = CONTRACT_LABELS[o.contract_type]
              return (
                <li key={o.id}>
                  <Link
                    href={`/${locale}/carrieres/${o.slug}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-terracotta/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h2 className="font-display text-xl font-semibold text-ink">{oTitle}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate">
                        {contract && (
                          <span className="rounded-full bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-ink">
                            {en ? contract.en : contract.fr}
                          </span>
                        )}
                        {o.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                            {o.location}
                          </span>
                        )}
                        {o.salary_range && <span>{o.salary_range}</span>}
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-terracotta-dark transition-all group-hover:gap-2.5">
                      {en ? 'View the role' : 'Voir le poste'}
                      <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-8 text-sm text-slate">
            {en ? 'Nothing fits? ' : 'Aucune offre ne correspond ? '}
            <Link
              href={`/${locale}/carrieres/candidature-spontanee`}
              className="font-medium text-terracotta-dark underline underline-offset-2 hover:text-terracotta"
            >
              {spontaneousCta}
            </Link>
          </p>
        </>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center">
          <p className="text-slate">{emptyText}</p>
          <Link
            href={`/${locale}/carrieres/candidature-spontanee`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-2"
          >
            {spontaneousCta}
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Careers — NRJKA' : 'Carrières — NRJKA',
    description: en
      ? 'Join NRJKA — a demanding, human-first digital agency. See our open roles.'
      : 'Rejoignez NRJKA — agence digitale exigeante et humaine. Découvrez nos offres.',
    alternates: {
      languages: await localizedLanguages({ fr: '/fr/carrieres', en: '/en/carrieres' }),
    },
  }
}
