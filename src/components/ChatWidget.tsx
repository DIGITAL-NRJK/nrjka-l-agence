'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'

// Widget de chatbot RAG (assistant NRJKA). Bas-gauche pour ne pas heurter le
// bouton d'accessibilité (bas-droite). Streaming depuis /api/chat.
// Conservation des échanges activée → consentement requis avant tout envoi (RGPD).

type Msg = { role: 'user' | 'assistant'; content: string }

const CONSENT_KEY = 'nrjka-chat-consent'
const CID_KEY = 'nrjka-chat-cid'

const t = (locale: string) =>
  locale === 'en'
    ? {
        open: 'Open the assistant',
        title: 'NRJKA Assistant',
        subtitle: 'Answers about our services',
        welcome:
          'Hi! I can help you learn about NRJKA’s services, method and projects. What would you like to know?',
        placeholder: 'Ask a question…',
        send: 'Send',
        consentTitle: 'Before we start',
        consentBody:
          'Your messages are stored to improve our service. By continuing, you agree to this. See our',
        privacy: 'privacy policy',
        accept: 'I agree & start',
        close: 'Close',
        thinking: 'Thinking…',
        unavailable: 'The assistant is currently unavailable. Please use the contact page.',
      }
    : {
        open: 'Ouvrir l’assistant',
        title: 'Assistant NRJKA',
        subtitle: 'Réponses sur nos services',
        welcome:
          'Bonjour ! Je peux vous renseigner sur les services, la méthode et les projets de NRJKA. Que souhaitez-vous savoir ?',
        placeholder: 'Posez une question…',
        send: 'Envoyer',
        consentTitle: 'Avant de commencer',
        consentBody:
          'Vos messages sont conservés pour améliorer le service. En continuant, vous l’acceptez. Voir notre',
        privacy: 'politique de confidentialité',
        accept: 'J’accepte et je démarre',
        close: 'Fermer',
        thinking: 'Réflexion…',
        unavailable: 'L’assistant est momentanément indisponible. Utilisez la page contact.',
      }

export const ChatWidget: React.FC<{ locale?: string }> = ({ locale = 'fr' }) => {
  const L = t(locale)
  const [open, setOpen] = useState(false)
  const [consented, setConsented] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const conversationId = useRef<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_KEY) === 'yes') setConsented(true)
      conversationId.current = localStorage.getItem(CID_KEY) || ''
    } catch {
      /* stockage indisponible */
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, busy])

  useEffect(() => {
    if (open && consented) inputRef.current?.focus()
  }, [open, consented])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const accept = () => {
    setConsented(true)
    try {
      localStorage.setItem(CONSENT_KEY, 'yes')
    } catch {
      /* ignore */
    }
  }

  const send = async () => {
    const question = input.trim()
    if (!question || busy) return
    const next: Msg[] = [...messages, { role: 'user', content: question }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          locale,
          consent: true,
          conversationId: conversationId.current || undefined,
        }),
      })

      const cid = res.headers.get('X-Conversation-Id')
      if (cid) {
        conversationId.current = cid
        try {
          localStorage.setItem(CID_KEY, cid)
        } catch {
          /* ignore */
        }
      }

      if (!res.ok || !res.body) {
        setMessages((m) => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: L.unavailable }
          return copy
        })
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages((m) => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: acc }
          return copy
        })
      }
    } catch {
      setMessages((m) => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: L.unavailable }
        return copy
      })
    } finally {
      setBusy(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={L.open}
        aria-expanded={open}
        className="fixed bottom-5 left-5 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-soft ring-1 ring-white/10 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Panneau */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={L.title}
          className="fixed bottom-20 left-5 z-[56] flex max-h-[75vh] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft"
        >
          {/* En-tête */}
          <div className="flex items-center gap-3 border-b border-border bg-brand px-4 py-3 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{L.title}</p>
              <p className="truncate text-xs text-white/70">{L.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={L.close}
              className="ml-auto rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!consented ? (
            /* Écran de consentement (conservation des échanges) */
            <div className="flex flex-col gap-4 p-5">
              <p className="text-sm font-semibold text-ink">{L.consentTitle}</p>
              <p className="text-sm leading-relaxed text-slate">
                {L.consentBody}{' '}
                <a href={`/${locale}/confidentialite`} className="text-terracotta-dark underline">
                  {L.privacy}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={accept}
                className="rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-2"
              >
                {L.accept}
              </button>
            </div>
          ) : (
            <>
              {/* Fil de discussion */}
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-soft px-3.5 py-2.5 text-sm leading-relaxed text-ink">
                  {L.welcome}
                </div>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === 'user'
                        ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-sm leading-relaxed text-white'
                        : 'max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-soft px-3.5 py-2.5 text-sm leading-relaxed text-ink'
                    }
                  >
                    {m.content || (
                      <span className="inline-flex gap-1 text-slate">
                        <span className="animate-pulse">●</span>
                        <span className="sr-only">{L.thinking}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Saisie */}
              <div className="border-t border-border p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder={L.placeholder}
                    className="max-h-28 flex-1 resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-ink outline-none placeholder:text-slate focus:border-terracotta/50"
                  />
                  <button
                    type="button"
                    onClick={send}
                    disabled={busy || !input.trim()}
                    aria-label={L.send}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-2 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
