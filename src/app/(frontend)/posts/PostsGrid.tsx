'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type BlogCategory = { slug: string; title: string }
export type PostSub = { slug: string; title: string; parentSlug: string }
export type CategoryNode = { slug: string; title: string; subs: BlogCategory[] }

export type PostItem = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  date: string
  categoryPath?: string | null
  poles: BlogCategory[]
  subs: PostSub[]
}

type Selection = { type: 'all' } | { type: 'pole'; slug: string } | { type: 'sub'; slug: string }

const PER_PAGE = 6

export const PostsGrid: React.FC<{ posts: PostItem[]; tree: CategoryNode[]; locale?: string }> = ({
  posts,
  tree,
  locale = 'fr',
}) => {
  const [sel, setSel] = useState<Selection>({ type: 'all' })
  const [page, setPage] = useState(1)

  // changer de filtre = revenir à la page 1
  const select = (s: Selection) => {
    setSel(s)
    setPage(1)
  }

  const isActive = (s: Selection) =>
    s.type === sel.type &&
    (s.type === 'all' || ('slug' in sel && sel.slug === (s as { slug: string }).slug))

  const filtered = useMemo(() => {
    if (sel.type === 'all') return posts
    if (sel.type === 'pole') return posts.filter((p) => p.poles.some((x) => x.slug === sel.slug))
    return posts.filter((p) => p.subs.some((x) => x.slug === sel.slug))
  }, [posts, sel])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pageCount)
  const paged = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const node = (active: boolean, isSub = false) =>
    [
      'block w-full rounded-lg px-3 py-1.5 text-left transition-colors',
      isSub ? 'text-sm' : 'font-medium',
      active
        ? 'bg-terracotta/10 text-terracotta-dark'
        : isSub
          ? 'text-slate hover:bg-surface-soft hover:text-ink'
          : 'text-ink hover:bg-surface-soft',
    ].join(' ')

  return (
    <div className="mt-12 lg:grid lg:grid-cols-[1fr_15rem] lg:gap-12">
      {/* Articles */}
      <div className="order-2 lg:order-1">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-12 text-center text-slate">
            Aucun article dans cette catégorie pour le moment.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {paged.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/posts/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-terracotta/40"
                >
                  {post.categoryPath && (
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-terracotta-dark">
                      {post.categoryPath}
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

            {/* Pagination */}
            {pageCount > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-2"
                aria-label="Pagination des articles"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={current === 1}
                  aria-label="Page précédente"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-slate transition-colors hover:border-brand/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={current === n ? 'page' : undefined}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors ${
                      current === n
                        ? 'border-terracotta bg-terracotta/10 text-ink'
                        : 'border-border text-slate hover:border-brand/30 hover:text-ink'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={current === pageCount}
                  aria-label="Page suivante"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-slate transition-colors hover:border-brand/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Filtre — arbre des catégories (menu de droite) */}
      {tree.length > 0 && (
        <aside className="order-1 mb-10 lg:order-2 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <h2 className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              <span className="h-px w-6 bg-terracotta" />
              Catégories
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => select({ type: 'all' })}
                  className={node(isActive({ type: 'all' }))}
                >
                  Tous les articles
                </button>
              </li>
              {tree.map((n) => (
                <li key={n.slug}>
                  <button
                    type="button"
                    onClick={() => select({ type: 'pole', slug: n.slug })}
                    className={node(isActive({ type: 'pole', slug: n.slug }))}
                  >
                    {n.title}
                  </button>
                  {n.subs.length > 0 && (
                    <ul className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                      {n.subs.map((s) => (
                        <li key={s.slug}>
                          <button
                            type="button"
                            onClick={() => select({ type: 'sub', slug: s.slug })}
                            className={node(isActive({ type: 'sub', slug: s.slug }), true)}
                          >
                            {s.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  )
}
