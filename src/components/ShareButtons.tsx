'use client'

import React, { useState } from 'react'
import { Mail, Link2, Check, MessageCircle, Send } from 'lucide-react'

// Boutons de partage : WhatsApp, Telegram, Email, copier le lien.
export const ShareButtons: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [copied, setCopied] = useState(false)
  const enc = encodeURIComponent

  const links = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${enc(`${title} ${url}`)}`,
      Icon: MessageCircle,
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
      Icon: Send,
    },
    { label: 'Email', href: `mailto:?subject=${enc(title)}&body=${enc(url)}`, Icon: Mail },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* presse-papier indisponible */
    }
  }

  const btn =
    'flex h-10 w-10 items-center justify-center rounded-full border border-border text-slate transition-colors hover:border-terracotta/40 hover:text-terracotta-dark'

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
        <span className="h-px w-6 bg-terracotta" />
        Partager
      </h2>
      <div className="flex flex-wrap gap-2">
        {links.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Partager sur ${label}`}
            title={label}
            className={btn}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label="Copier le lien"
          title={copied ? 'Lien copié' : 'Copier le lien'}
          className={btn}
        >
          {copied ? (
            <Check className="h-[18px] w-[18px] text-terracotta-dark" strokeWidth={2.4} />
          ) : (
            <Link2 className="h-[18px] w-[18px]" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  )
}
