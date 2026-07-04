'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * 404 des routes publiques. Placée sous [locale] pour hériter de [locale]/layout.tsx
 * (html + header + footer + styles). Déclenchée par notFound() via PayloadRedirects.
 */
export default function NotFound() {
  const pathname = usePathname()
  const en = pathname?.startsWith('/en')
  const base = en ? '/en' : '/fr'

  const t = en
    ? {
        title: 'Page not found',
        body: 'The page you’re looking for doesn’t exist or has moved.',
        home: 'Back to homepage',
        audit: 'Request an audit',
      }
    : {
        title: 'Page introuvable',
        body: 'La page que vous cherchez n’existe pas ou a été déplacée.',
        home: 'Retour à l’accueil',
        audit: 'Demander un audit',
      }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="text-[7rem] font-bold leading-none tracking-tight text-terracotta-dark sm:text-[9rem]">
          404
        </div>
        <span className="mx-auto mt-2 block h-px w-10 bg-terracotta" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
        <p className="mt-4 leading-relaxed text-slate">{t.body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={base}
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
          >
            {t.home}
          </Link>
          <Link
            href={`${base}/demander-un-audit`}
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-medium text-ink transition-colors hover:bg-card"
          >
            {t.audit}
          </Link>
        </div>
      </div>
    </section>
  )
}
