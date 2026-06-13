'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const objetOptions = [
  { value: 'quote', label: 'Demander un audit gratuit' },
  { value: 'general', label: 'Question générale' },
  { value: 'partnership', label: 'Partenariat' },
]

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    type: 'quote',
  })

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source_tool: 'contact' }),
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

  const fieldClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition-colors placeholder:text-slate/60 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
  const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

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
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={update('name')}
            className={fieldClass}
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-terracotta-dark">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className={fieldClass}
            placeholder="vous@exemple.fr"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            className={fieldClass}
            placeholder="06 00 00 00 00"
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Entreprise / structure
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={update('company')}
            className={fieldClass}
            placeholder="Nom de votre structure"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="type" className={labelClass}>
          Objet
        </label>
        <select id="type" value={form.type} onChange={update('type')} className={fieldClass}>
          {objetOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

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
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2.4}
          />
        )}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-slate">
        Vos informations servent uniquement à traiter votre demande. Aucune revente, aucune
        newsletter imposée.
      </p>
    </form>
  )
}
