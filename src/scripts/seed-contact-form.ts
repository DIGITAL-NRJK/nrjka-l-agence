/* eslint-disable @typescript-eslint/no-explicit-any */
// Crée le formulaire « Contact » (collection Forms, éditable dans l'admin) et le
// rattache au bloc Contact de la page /contact. Idempotent : ne réécrit pas un
// formulaire existant ni un bloc déjà relié (pour préserver les réglages de l'user).
import { toLexical } from './_md-to-lexical'

// Hybride : champs classiques + un domaine (select) + des cases « services » (éditables
// dans l'admin Forms : ajouter/retirer/renommer). Pas de cascade dynamique des besoins.
const fields = [
  { blockType: 'text', name: 'nom', label: 'Nom', required: true },
  { blockType: 'email', name: 'email', label: 'Email', required: true },
  { blockType: 'text', name: 'entreprise', label: 'Entreprise / structure' },
  { blockType: 'text', name: 'telephone', label: 'Téléphone' },
  {
    blockType: 'select',
    name: 'domaine',
    label: 'Quel domaine vous intéresse ?',
    options: [
      { label: 'Marque & Contenu', value: 'marque-contenu' },
      { label: 'Web & Expérience', value: 'web-experience' },
      { label: 'Performance & Visibilité', value: 'performance-visibilite' },
      { label: 'Digitalisation & Process', value: 'digitalisation-process' },
      { label: 'Autre / je ne sais pas encore', value: 'autre' },
    ],
  },
  { blockType: 'message', message: toLexical('**Quels services ?** Plusieurs choix possibles.') },
  { blockType: 'checkbox', name: 'service_site_web', label: 'Site web / vitrine' },
  { blockType: 'checkbox', name: 'service_ecommerce', label: 'E-commerce' },
  { blockType: 'checkbox', name: 'service_seo', label: 'SEO & visibilité' },
  { blockType: 'checkbox', name: 'service_automatisation', label: 'Automatisation des process' },
  { blockType: 'checkbox', name: 'service_crm_erp', label: 'CRM / ERP / gestion' },
  { blockType: 'checkbox', name: 'service_formation', label: 'Formation & autonomie' },
  { blockType: 'textarea', name: 'message', label: 'Votre projet en quelques mots', required: true },
]

export async function seedContactForm(payload: any) {
  // 1) Formulaire « Contact » (créé une seule fois)
  let formId: number | string
  const existingForm = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact' } },
    limit: 1,
    pagination: false,
  })
  if (existingForm.docs[0]) {
    formId = existingForm.docs[0].id
  } else {
    const created = await payload.create({
      collection: 'forms',
      data: {
        title: 'Contact',
        submitButtonLabel: 'Envoyer le message',
        confirmationType: 'message',
        confirmationMessage: toLexical(
          '## Merci, message bien reçu !\n\nOn vous répond sous 48 h — par une vraie personne, pas un ticket.',
        ),
        fields,
      },
    })
    formId = created.id
  }

  // 2) Rattacher au bloc Contact de la page /contact (si pas déjà relié)
  const pageRes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'contact' } },
    limit: 1,
    pagination: false,
    depth: 0,
  })
  const page = pageRes.docs[0]
  let wired = false
  if (page && Array.isArray(page.layout)) {
    let changed = false
    const layout = page.layout.map((b: any) => {
      if (b?.blockType === 'contact' && !b.form) {
        changed = true
        return { ...b, form: formId }
      }
      return b
    })
    if (changed) {
      await payload.update({ collection: 'pages', id: page.id, data: { layout } })
      wired = true
    }
  }

  return { ok: true, formId, wired }
}
