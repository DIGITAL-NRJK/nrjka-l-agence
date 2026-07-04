'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

/**
 * Garde-fou d'erreur pour les pages publiques (segment [locale]).
 * S'affiche À LA PLACE du contenu de page, en conservant header + footer.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const en = pathname?.startsWith('/en')

  useEffect(() => {
    // Journalisation ; un monitoring (Sentry, P2.4) pourra se brancher ici.
    console.error('Erreur de rendu :', error)
  }, [error])

  const t = en
    ? {
        eyebrow: 'Error',
        title: 'Something went wrong',
        body: 'An unexpected error occurred. You can try again, or head back to the homepage.',
        retry: 'Try again',
        home: 'Back to homepage',
      }
    : {
        eyebrow: 'Erreur',
        title: 'Une erreur est survenue',
        body: 'Un problème inattendu s’est produit. Vous pouvez réessayer, ou revenir à l’accueil.',
        retry: 'Réessayer',
        home: 'Retour à l’accueil',
      }

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          <span className="h-px w-8 bg-terracotta" />
          {t.eyebrow}
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
        <p className="mt-4 leading-relaxed text-slate">{t.body}</p>
        {error?.digest && (
          <p className="mt-2 text-xs text-slate/70">Réf. : {error.digest}</p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground transition-colors hover:bg-terracotta-dark"
          >
            {t.retry}
          </button>
          <Link
            href={en ? '/en' : '/fr'}
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-medium text-ink transition-colors hover:bg-card"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </section>
  )
}
