'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type BlogCategory = { slug: string; title: string }
export type PostSub = { slug: string; title: string; parentSlug: string }

export type PostItem = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  date: string
  categoryTitle?: string | null
  poles: BlogCategory[]
  subs: PostSub[]
}

const chip = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition-colors ${
    active
      ? 'border-terracotta bg-terracotta/10 text-ink'
      : 'border-border text-slate hover:border-brand/30 hover:text-ink'
  }`

export const PostsGrid: React.FC<{ posts: PostItem[]; categories: BlogCategory[] }> = ({
  posts,
  categories,
}) => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const selectCategory = (slug: string | null) => {
    setSelectedCat(slug)
    setSelectedService(null) // on repart de zéro au changement de pôle
  }

  // Sous-catégories du pôle sélectionné (2e niveau), dédupliquées
  const subServices = useMemo<BlogCategory[]>(() => {
    if (!selectedCat) return []
    const map = new Map<string, string>()
    for (const p of posts) {
      if (!p.poles.some((pole) => pole.slug === selectedCat)) continue
      for (const s of p.subs) if (s.parentSlug === selectedCat) map.set(s.slug, s.title)
    }
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }))
  }, [posts, selectedCat])

  const filtered = useMemo(() => {
    let list = posts
    if (selectedCat) list = list.filter((p) => p.poles.some((pole) => pole.slug === selectedCat))
    if (selectedService) list = list.filter((p) => p.subs.some((s) => s.slug === selectedService))
    return list
  }, [posts, selectedCat, selectedService])

  const [featured, ...rest] = filtered

  return (
    <div>
      {/* Filtres — niveau 1 : pôles */}
      {categories.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => selectCategory(null)} className={chip(!selectedCat)}>
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCategory(c.slug)}
              className={chip(selectedCat === c.slug)}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {/* Filtres — niveau 2 : services du pôle sélectionné */}
      {selectedCat && subServices.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-l-2 border-terracotta/30 pl-4">
          <button
            type="button"
            onClick={() => setSelectedService(null)}
            className={chip(!selectedService)}
          >
            Tout le pôle
          </button>
          {subServices.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSelectedService(s.slug)}
              className={chip(selectedService === s.slug)}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <>
          {/* À la une */}
          {featured && (
            <Link
              href={`/posts/${featured.slug}`}
              className="group mt-8 block rounded-3xl border border-border bg-surface-soft p-8 transition-all hover:border-terracotta/40 sm:p-10"
            >
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-terracotta-dark">
                {featured.categoryTitle && <span>{featured.categoryTitle}</span>}
                <span className="text-slate">{featured.date}</span>
              </div>
              <h2 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-terracotta-dark sm:text-3xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-3 max-w-2xl leading-relaxed text-slate">{featured.excerpt}</p>
              )}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-all group-hover:gap-2.5">
                Lire l’article
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </span>
            </Link>
          )}

          {/* Grille */}
          {rest.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-terracotta/40"
                >
                  {post.categoryTitle && (
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-terracotta-dark">
                      {post.categoryTitle}
                    </span>
                  )}
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-terracotta-dark">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-auto pt-4 text-xs text-slate">{post.date}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
