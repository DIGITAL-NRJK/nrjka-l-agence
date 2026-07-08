import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { JobApplicationForm, type JobFormLabels } from '@/components/JobApplicationForm'

export const revalidate = 300

type Args = { params: Promise<{ locale: string }> }

export default async function SpontaneousApplicationPage({ params }: Args) {
  const { locale } = await params
  const en = locale === 'en'

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
  const s = g?.spontaneous || {}
  const formLabels: JobFormLabels = g?.form || {}

  const eyebrow = s.eyebrow || (en ? 'Spontaneous application' : 'Candidature spontanée')
  const title = s.title || (en ? 'Tell us about you' : 'Parlez-nous de vous')
  const intro =
    s.intro ||
    (en
      ? 'No open role fits right now, but you think you belong at NRJKA? Send us your profile — we read every application.'
      : 'Aucune offre ne correspond pour l’instant, mais vous pensez avoir votre place chez NRJKA ? Envoyez-nous votre profil — nous lisons chaque candidature.')
  const lookForHeading = s.lookForHeading || (en ? 'What we look at' : 'Ce qu’on regarde')
  const lookFor: string[] =
    (Array.isArray(s.lookFor) ? s.lookFor : [])
      .map((x: { text?: string }) => x?.text)
      .filter((v: unknown): v is string => Boolean(v)).length > 0
      ? s.lookFor.map((x: { text?: string }) => x.text as string)
      : en
        ? [
            'Mindset and drive — as much as the CV.',
            'Curiosity, autonomy, and care for good work.',
            'What you love doing — tell us where you shine.',
          ]
        : [
            'L’état d’esprit et l’envie, autant que le CV.',
            'La curiosité, l’autonomie et le goût du travail bien fait.',
            'Ce que vous aimez faire — dites-nous où vous êtes le plus utile.',
          ]
  const nextHeading = s.nextHeading || (en ? 'What happens next?' : 'Et après ?')
  const nextText =
    s.nextText ||
    (en
      ? 'We read every application. If your profile speaks to us, we reach out within about two weeks to get to know each other — no endless process.'
      : 'On lit chaque candidature. Si votre profil nous parle, on vous recontacte sous deux semaines environ pour faire connaissance — sans process interminable.')

  return (
    <div className="container pt-16 pb-24 sm:pt-20">
      <Link
        href={`/${locale}/carrieres`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
        {en ? 'All roles' : 'Toutes les offres'}
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-16">
        <div className="max-w-xl">
          <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate">{intro}</p>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{lookForHeading}</h2>
            <ul className="mt-4 space-y-3">
              {lookFor.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-slate">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" strokeWidth={2.4} />
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-surface-soft p-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{nextHeading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">{nextText}</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <JobApplicationForm jobOfferId="" jobTitle="" locale={locale} labels={formLabels} />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Spontaneous application — NRJKA' : 'Candidature spontanée — NRJKA',
    description: en
      ? 'Send NRJKA a spontaneous application.'
      : 'Envoyez à NRJKA une candidature spontanée.',
    alternates: {
      languages: {
        fr: '/fr/carrieres/candidature-spontanee',
        en: '/en/carrieres/candidature-spontanee',
      },
    },
  }
}
