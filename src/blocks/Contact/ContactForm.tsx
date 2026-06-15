'use client'

import React, { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export type ContactFormService = { id: string; title: string; besoins: string[] }
export type ContactFormPole = { id: string; title: string; services: ContactFormService[] }

type Status = 'idle' | 'submitting' | 'success' | 'error'

const fieldClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition-colors placeholder:text-slate/60 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

const CheckRow: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-terracotta accent-terracotta"
    />
    <span className="leading-snug">{label}</span>
  </label>
)

export const ContactForm: React.FC<{ poles?: ContactFormPole[] }> = ({ poles = [] }) => {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [poleId, setPoleId] = useState('')
  const [serviceIds, setServiceIds] = useState<string[]>([])
  const [besoins, setBesoins] = useState<string[]>([])

  const pole = useMemo(() => poles.find((p) => p.id === poleId) || null, [poles, poleId])
  const selectedServices = useMemo(
    () => (pole ? pole.services.filter((s) => serviceIds.includes(s.id)) : []),
    [pole, serviceIds],
  )

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

  const onPoleChange = (id: string) => {
    setPoleId(id)
    setServiceIds([])
    setBesoins([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'quote',
          source_tool: 'contact',
          service_type: pole?.title || '',
          services_needed: selectedServices.map((s) => ({ service: s.title })),
          priorities: besoins.map((b) => ({ priority: b })),
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-surface-soft p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/15 text-terracotta-dark">
          <CheckCircle2 className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Message bien reçu.
        </h2>
        <p className="max-w-md leading-relaxed text-slate">
          Merci {form.name ? form.name.split(' ')[0] : ''}. On revient vers vous sous 48&nbsp;heures
          ouvrées, avec une vraie personne — pas un accusé de réception automatique.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-surface-soft p-6 shadow-soft sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nom <span className="text-terracotta-dark">*</span>
          </label>
          <input id="name" type="text" required autoComplete="name" value={form.name} onChange={update('name')} className={fieldClass} placeholder="Votre nom" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-terracotta-dark">*</span>
          </label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} className={fieldClass} placeholder="vous@exemple.fr" />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Entreprise / structure
          </label>
          <input id="company" type="text" autoComplete="organization" value={form.company} onChange={update('company')} className={fieldClass} placeholder="Nom de votre structure" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Téléphone
          </label>
          <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} className={fieldClass} placeholder="06 00 00 00 00" />
        </div>
      </div>

      {/* Niveau 1 — Pôle */}
      {poles.length > 0 && (
        <div className="mt-5">
          <label htmlFor="pole" className={labelClass}>
            Quel domaine vous intéresse ?
          </label>
          <select id="pole" value={poleId} onChange={(e) => onPoleChange(e.target.value)} className={fieldClass}>
            <option value="">Sélectionnez un pôle…</option>
            {poles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Niveau 2 — Services du pôle */}
      {pole && pole.services.length > 0 && (
        <div className="mt-5">
          <span className={labelClass}>Quels services ? (plusieurs choix possibles)</span>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {pole.services.map((s) => (
              <CheckRow
                key={s.id}
                checked={serviceIds.includes(s.id)}
                onChange={() => setServiceIds((arr) => toggle(arr, s.id))}
                label={s.title}
              />
            ))}
          </div>
        </div>
      )}

      {/* Niveau 3 — Besoins par service sélectionné */}
      {selectedServices.filter((s) => s.besoins.length > 0).map((s) => (
        <div key={s.id} className="mt-5 rounded-2xl border border-border bg-background p-4">
          <span className="mb-2 block text-sm font-medium text-ink">
            {s.title} — vos besoins
          </span>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {s.besoins.map((b) => (
              <CheckRow
                key={b}
                checked={besoins.includes(b)}
                onChange={() => setBesoins((arr) => toggle(arr, b))}
                label={b}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          Votre projet en quelques mots <span className="text-terracotta-dark">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={update('message')}
          className={`${fieldClass} resize-y`}
          placeholder="Décrivez votre besoin, même vaguement. On s'occupe de clarifier ensemble."
        />
      </div>

      {status === 'error' && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Une erreur est survenue à l&apos;envoi. Réessayez, ou écrivez-nous directement par email.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-xl hover:shadow-terracotta/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? 'Envoi…' : 'Envoyer ma demande'}
        {status !== 'submitting' && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
        )}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-slate">
        Vos informations servent uniquement à traiter votre demande. Aucune revente, aucune
        newsletter imposée.
      </p>
    </form>
  )
}
