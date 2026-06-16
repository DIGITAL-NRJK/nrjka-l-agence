'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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

type Selection =
  | { type: 'all' }
  | { type: 'pole'; slug: string }
  | { type: 'sub'; slug: string }

export const PostsGrid: React.FC<{ posts: PostItem[]; tree: CategoryNode[] }> = ({
  posts,
  tree,
}) => {
  const [sel, setSel] = useState<Selection>({ type: 'all' })

  const isActive = (s: Selection) =>
    s.type === sel.type && (s.type === 'all' || ('slug' in sel && sel.slug === (s as { slug: string }).slug))

  const filtered = useMemo(() => {
    if (sel.type === 'all') return posts
    if (sel.type === 'pole') return posts.filter((p) => p.poles.some((x) => x.slug === sel.slug))
    return posts.filter((p) => p.subs.some((x) => x.slug === sel.slug))
  }, [posts, sel])

  const [featured, ...rest] = filtered

  // Lien de l'arbre : bouton pleine largeur, état actif terracotta
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
            {featured && (
              <Link
                href={`/posts/${featured.slug}`}
                className="group block rounded-3xl border border-border bg-surface-soft p-8 transition-all hover:border-terracotta/40 sm:p-10"
              >
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-terracotta-dark">
                  {featured.categoryPath && <span>{featured.categoryPath}</span>}
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

            {rest.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
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
                  onClick={() => setSel({ type: 'all' })}
                  className={node(isActive({ type: 'all' }))}
                >
                  Tous les articles
                </button>
              </li>
              {tree.map((n) => (
                <li key={n.slug}>
                  <button
                    type="button"
                    onClick={() => setSel({ type: 'pole', slug: n.slug })}
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
                            onClick={() => setSel({ type: 'sub', slug: s.slug })}
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
