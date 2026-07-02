import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  Calendar,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import type { ContactBlock as ContactBlockProps } from '@/payload-types'
import { bgStyle, colorStyle, textClass, titleClass } from '@/utilities/appearance'

import { ContactForm, type ContactFormPole } from './ContactForm'

const iconMap = {
  messageSquare: MessageSquare,
  clock: Clock,
  shieldCheck: ShieldCheck,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  fileText: FileText,
  sparkles: Sparkles,
}

const defaultSteps = [
  {
    icon: 'messageSquare',
    title: 'Vous nous écrivez',
    text: 'Un projet précis ou une simple idée à creuser : les deux sont bienvenus.',
  },
  {
    icon: 'clock',
    title: 'On échange sous 48 h',
    text: 'Un premier retour clair et gratuit, par une vraie personne — pas un ticket.',
  },
  {
    icon: 'shieldCheck',
    title: 'On vous propose un plan',
    text: 'Des pistes concrètes et un cadre transparent. Vous décidez de la suite.',
  },
]

export const ContactBlock = async (props: ContactBlockProps) => {
  const { eyebrow, title, titleAccent, subtitle, stepsHeading, steps, emailIntro, email } = props
  const a = props.appearance || {}

  const stepList = steps && steps.length > 0 ? steps : defaultSteps
  const mail = email || 'contact@nrjka.com'

  // Cascade Pôle → Services → Besoins, alimentée par les collections (éditable dans l'admin :
  // pôles = « Pôles & Expertises », services = « Services », besoins = champ « Besoins » du service).
  let formPoles: ContactFormPole[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const [polesRes, servicesRes] = await Promise.all([
      payload.find({
        collection: 'expertises',
        where: { published: { equals: true } },
        sort: 'order',
        limit: 20,
        depth: 0,
      }),
      payload.find({
        collection: 'services',
        where: { published: { equals: true } },
        sort: 'order',
        limit: 200,
        depth: 0,
      }),
    ])
    const byPole: Record<string, { id: string; title: string; besoins: string[] }[]> = {}
    for (const s of servicesRes.docs as {
      id: unknown
      title: string
      pole: unknown
      besoins?: { label?: string | null }[] | null
    }[]) {
      const pid =
        s.pole && typeof s.pole === 'object' ? String((s.pole as { id: unknown }).id) : String(s.pole)
      const besoins = (s.besoins || []).map((b) => b.label).filter(Boolean) as string[]
      ;(byPole[pid] ||= []).push({ id: String(s.id), title: s.title, besoins })
    }
    formPoles = (polesRes.docs as { id: unknown; title: string }[]).map((p) => ({
      id: String(p.id),
      title: p.title,
      services: byPole[String(p.id)] || [],
    }))
  } catch {
    formPoles = []
  }

  return (
    <section className="container" style={bgStyle(a.background)}>
      {/* En-tête */}
      <div className="max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {eyebrow || 'Contact'}
        </span>
        <h2
          className={`${titleClass(a, 'text-4xl sm:text-5xl lg:text-6xl')} font-display font-bold leading-[1.05] tracking-tight text-ink`}
          style={colorStyle(a.titleColor)}
        >
          {title || 'Parlons de votre'}
          {titleAccent && (
            <>
              {' '}
              <span className="relative inline-block sm:whitespace-nowrap text-terracotta-dark">
                {titleAccent}
              </span>
            </>
          )}
        </h2>
        {subtitle && (
          <p
            className={`${textClass(a, 'text-lg')} mt-6 max-w-xl leading-relaxed text-slate`}
            style={colorStyle(a.textColor)}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Deux colonnes */}
      <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Colonne gauche : ce qui se passe ensuite */}
        <div className="lg:sticky lg:top-28">
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-slate">
            {stepsHeading || 'Ce qui se passe ensuite'}
          </h3>
          <ol className="mt-7 space-y-7">
            {stepList.map((step, i) => {
              const Icon = iconMap[(step.icon as keyof typeof iconMap) || 'messageSquare'] || MessageSquare
              return (
                <li key={i} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-terracotta">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-sm font-semibold text-terracotta-dark">
                        {`0${i + 1}`}
                      </span>
                      <h4 className="font-semibold text-ink">{step.title}</h4>
                    </div>
                    {step.text && <p className="mt-1 text-sm leading-relaxed text-slate">{step.text}</p>}
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm leading-relaxed text-slate">
              {emailIntro || 'Pas encore prêt à écrire ? Vous pouvez aussi nous joindre par email à'}{' '}
              <a
                href={`mailto:${mail}`}
                className="font-medium text-ink underline decoration-terracotta decoration-2 underline-offset-4 transition-colors hover:text-terracotta-dark"
              >
                {mail}
              </a>
              .
            </p>
          </div>
        </div>

        {/* Colonne droite : formulaire en cascade (Pôle → Services → Besoins) */}
        <ContactForm poles={formPoles} />
      </div>
    </section>
  )
}
