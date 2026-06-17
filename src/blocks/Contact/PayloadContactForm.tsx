'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import RichText from '@/components/RichText'
import { fields } from '@/blocks/Form/fields'
import { getClientSideURL } from '@/utilities/getURL'

// Formulaire Payload (collection Forms) rendu dans la colonne droite du bloc Contact.
// Réutilise les champs du form-builder ; soumet vers /api/form-submissions (réponses
// visibles dans « Form Submissions »). Style NRJKA, grille 2 colonnes.
export const PayloadContactForm: React.FC<{ form: FormType }> = ({ form }) => {
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
  } = form || {}

  const formMethods = useForm({ defaultValues: form?.fields })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submit = async () => {
        setError(undefined)
        const dataToSend = Object.entries(data).map(([name, value]) => ({ field: name, value }))
        loadingTimerID = setTimeout(() => setIsLoading(true), 1000)
        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData: dataToSend }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
          const res = await req.json()
          clearTimeout(loadingTimerID)
          if (req.status >= 400) {
            setIsLoading(false)
            setError({ message: res.errors?.[0]?.message || 'Une erreur est survenue.', status: res.status })
            return
          }
          setIsLoading(false)
          setHasSubmitted(true)
          window.umami?.track('contact_form_submit')
          if (confirmationType === 'redirect' && redirect?.url) router.push(redirect.url)
        } catch {
          clearTimeout(loadingTimerID)
          setIsLoading(false)
          setError({ message: 'Une erreur est survenue. Réessayez ou écrivez-nous par email.' })
        }
      }
      void submit()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText data={confirmationMessage} />
        )}
        {error && (
          <div className="mb-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error.message}
          </div>
        )}
        {!hasSubmitted && (
          <form id={String(formID)} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 sm:grid-cols-2">
              {(form?.fields || []).map((field, index) => {
                const Field = fields?.[field.blockType as keyof typeof fields] as React.FC<
                  Record<string, unknown>
                >
                if (!Field) return null
                const wide = ['textarea', 'message', 'select', 'country', 'state'].includes(
                  field.blockType as string,
                )
                return (
                  <div key={index} className={wide ? 'sm:col-span-2' : ''}>
                    <Field
                      form={form}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                    />
                  </div>
                )
              })}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-medium text-terracotta-foreground shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? 'Envoi en cours…' : submitButtonLabel || 'Envoyer'}
            </button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}
