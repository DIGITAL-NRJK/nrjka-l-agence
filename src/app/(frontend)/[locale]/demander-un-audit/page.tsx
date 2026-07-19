import type { Metadata } from 'next'
import React from 'react'
import { CheckCircle } from 'lucide-react'

import { AuditForm } from '@/components/AuditForm/AuditForm'
import { getServerSideURL } from '@/utilities/getURL'
import { localizedLanguages } from '@/utilities/languages'

type Args = { params: Promise<{ locale: string }> }

const PATH = '/demander-un-audit'

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  const base = getServerSideURL()
  return {
    title: en ? 'Request an audit — NRJKA' : 'Demander un audit — NRJKA',
    description: en
      ? 'Answer a few questions about your project — we reply within 48h with a first diagnosis and next steps.'
      : 'Quelques questions sur votre projet — nous revenons sous 48 h avec un premier diagnostic et les prochaines étapes.',
    alternates: {
      canonical: `${base}/${locale}${PATH}`,
      languages: await localizedLanguages({
        fr: `${base}/fr${PATH}`,
        en: `${base}/en${PATH}`,
        'x-default': `${base}/fr${PATH}`,
      }),
    },
  }
}

export default async function DemanderUnAuditPage({ params }: Args) {
  const { locale } = await params
  const en = locale === 'en'

  const copy = en
    ? {
        eyebrow: 'Free audit',
        title: 'Request your',
        accent: 'audit',
        subtitle:
          'A few questions about your existing website. We reply within 48 hours with a first diagnosis and clear next steps.',
        points: ['Tailored diagnosis', 'Reply within 48h', 'No commitment'],
      }
    : {
        eyebrow: 'Audit gratuit',
        title: 'Demandez votre',
        accent: 'audit',
        subtitle:
          'Quelques questions sur votre site existant. Nous revenons vers vous sous 48 h avec un premier diagnostic et des étapes claires.',
        points: ['Diagnostic personnalisé', 'Réponse sous 48 h', 'Sans engagement'],
      }

  return (
    <section className="pt-16 pb-24">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-12 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
        {/* Colonne gauche : pitch */}
        <div className="lg:sticky lg:top-28">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
            <span className="h-px w-8 bg-terracotta" />
            {copy.eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {copy.title} <span className="text-terracotta-dark">{copy.accent}</span>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-slate">{copy.subtitle}</p>
          <ul className="mt-8 space-y-3">
            {copy.points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <CheckCircle className="h-5 w-5 text-terracotta" strokeWidth={2.2} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite : formulaire */}
        <AuditForm locale={locale} />
      </div>
    </section>
  )
}
