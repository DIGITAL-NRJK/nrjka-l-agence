import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

import { embedOne, cosineSimilarity, streamChat, aiConfigured, type ChatMessage } from '@/utilities/mistral'
import { LOCALES } from '@/utilities/i18n'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

type ClientMessage = { role: 'user' | 'assistant'; content: string }

const TOP_K = 6
const MIN_SCORE = 0.2
const MAX_CONTEXT_CHARS = 4500
const MAX_HISTORY = 10

const systemPrompt = (locale: string, context: string): string => {
  if (locale === 'en') {
    return `You are the virtual assistant of NRJKA, a digital agency (brand & content, web experience, performance & visibility, process digitalisation) known for its D4™ method (Diagnostic · Design · Development · Durability).

Rules:
- Answer ONLY from the CONTEXT below. If the answer is not there, say you don't have that information and invite the visitor to use the contact page (/en/contact) or request a free audit (/en/demander-un-audit).
- Never invent prices, figures, guarantees or client names.
- Be concise, warm and professional. Use plain language, short paragraphs.
- When the visitor shows buying intent (quote, project, "how much", "get started"), suggest requesting a free audit.
- Always reply in English.

CONTEXT:
${context || '(no context retrieved)'}`
  }
  return `Tu es l'assistant virtuel de NRJKA, une agence digitale (marque & contenu, web & expérience, performance & visibilité, digitalisation des process) reconnue pour sa méthode D4™ (Diagnostic · Design · Développement · Durabilité).

Règles :
- Réponds UNIQUEMENT à partir du CONTEXTE ci-dessous. Si l'information n'y est pas, dis que tu ne l'as pas et invite à utiliser la page contact (/fr/contact) ou à demander un audit gratuit (/fr/demander-un-audit).
- N'invente jamais de tarifs, chiffres, garanties ou noms de clients.
- Sois concis, chaleureux et professionnel. Langage clair, paragraphes courts.
- Quand le visiteur montre une intention (devis, projet, « combien », « démarrer »), propose de demander un audit gratuit.
- Réponds toujours en français.

CONTEXTE :
${context || '(aucun contexte récupéré)'}`
}

export async function POST(req: Request) {
  if (!aiConfigured()) {
    return NextResponse.json({ error: 'Chatbot indisponible (non configuré).' }, { status: 503 })
  }

  let body: {
    messages?: ClientMessage[]
    locale?: string
    conversationId?: string
    consent?: boolean
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const locale = body.locale && LOCALES.includes(body.locale as never) ? body.locale : 'fr'
  const consent = body.consent === true
  const rawMessages = Array.isArray(body.messages) ? body.messages : []

  // Nettoyage + bornage de l'historique.
  const history: ClientMessage[] = rawMessages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    .slice(-MAX_HISTORY)

  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  if (!lastUser) {
    return NextResponse.json({ error: 'Aucune question fournie.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config: configPromise })

  // --- Récupération (RAG) : embedding de la question → cosinus sur la base ---
  let context = ''
  try {
    const qVec = await embedOne(lastUser.content)
    const res = await payload.find({
      collection: 'knowledge-chunks',
      where: { locale: { equals: locale } },
      limit: 3000,
      pagination: false,
      depth: 0,
    })
    const scored = (res.docs as Record<string, unknown>[])
      .map((d) => ({
        title: d.title as string,
        text: d.text as string,
        url: d.url as string,
        score: cosineSimilarity(qVec, (d.embedding as number[]) || []),
      }))
      .filter((d) => d.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K)

    let acc = ''
    for (const d of scored) {
      const block = `[${d.title}] ${d.text} (source: ${d.url})`
      if (acc.length + block.length > MAX_CONTEXT_CHARS) break
      acc += (acc ? '\n\n' : '') + block
    }
    context = acc
  } catch {
    context = '' // en cas d'échec du RAG, le prompt guidera vers le contact
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt(locale, context) },
    ...history,
  ]

  // --- Persistance (avec consentement uniquement) ---
  let conversationId = body.conversationId || ''
  if (consent) {
    try {
      const storedMessages = history.map((m) => ({
        role: m.role,
        content: m.content,
        at: new Date().toISOString(),
      }))
      const summary = lastUser.content.slice(0, 120)
      if (conversationId) {
        await payload.update({
          collection: 'chat-conversations',
          id: conversationId,
          data: { messages: storedMessages, locale, consent: true, turns: storedMessages.length },
        })
      } else {
        const doc = await payload.create({
          collection: 'chat-conversations',
          data: {
            summary,
            locale,
            consent: true,
            turns: storedMessages.length,
            messages: storedMessages,
          },
        })
        conversationId = String(doc.id)
      }
    } catch {
      // La persistance ne doit jamais bloquer la réponse.
    }
  }

  // --- Réponse en streaming ---
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let assistant = ''
      try {
        for await (const delta of streamChat(messages, { temperature: 0.3, maxTokens: 800 })) {
          assistant += delta
          controller.enqueue(encoder.encode(delta))
        }
      } catch {
        const msg =
          locale === 'en'
            ? '\n\nSorry, a technical issue occurred. Please try again or use the contact page.'
            : '\n\nDésolé, un souci technique est survenu. Réessayez ou passez par la page contact.'
        controller.enqueue(encoder.encode(msg))
        assistant += msg
      }

      // Enregistre la réponse de l'assistant (si consentement + conversation créée).
      if (consent && conversationId && assistant.trim()) {
        try {
          const full = [
            ...history.map((m) => ({ role: m.role, content: m.content, at: new Date().toISOString() })),
            { role: 'assistant', content: assistant, at: new Date().toISOString() },
          ]
          await payload.update({
            collection: 'chat-conversations',
            id: conversationId,
            data: { messages: full, turns: full.length },
          })
        } catch {
          /* silencieux */
        }
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Conversation-Id': conversationId,
    },
  })
}
