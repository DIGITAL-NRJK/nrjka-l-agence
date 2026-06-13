/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Crée (ou met à jour) les pages légales « Mentions légales » et « Confidentialité »,
 * publiées, avec un bloc Contenu, et ajoute leurs liens dans le footer.
 * Lancement : pnpm payload run src/scripts/seed-legal.ts
 * Tout reste éditable ensuite dans l'admin. Pense à compléter les champs [À COMPLÉTER].
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

// --- Contenus ---
const mentions = `## Mentions légales

### Éditeur du site
Le site nrjka.com est édité par NRJKA — [À COMPLÉTER : forme juridique, ex. SAS / SASU / micro-entreprise].
Capital social : [À COMPLÉTER].
Siège social : [À COMPLÉTER : adresse].
SIRET : [À COMPLÉTER] — RCS [À COMPLÉTER : ville].
N° de TVA intracommunautaire : [À COMPLÉTER].
E-mail : contact@nrjka.com — Téléphone : [À COMPLÉTER].

### Directeur de la publication
[À COMPLÉTER : nom du directeur de la publication].

### Hébergement
Le site est hébergé par **Netlify, Inc.** — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis (netlify.com).
Base de données : **Neon, Inc.** (États-Unis). Stockage des médias : **Cloudflare, Inc.** (Cloudflare R2).

### Propriété intellectuelle
L'ensemble des contenus du site (textes, visuels, logos, éléments graphiques, code) est, sauf mention contraire, la propriété exclusive de NRJKA ou de ses partenaires. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans autorisation écrite préalable, est interdite et constitue une contrefaçon.

### Liens hypertextes
Le site peut contenir des liens vers des sites tiers. NRJKA n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.

### Données personnelles
Le traitement de vos données personnelles est détaillé dans notre Politique de confidentialité, accessible à l'adresse /confidentialite.

### Droit applicable
Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.`

const confidentialite = `## Politique de confidentialité

Chez NRJKA, la protection de vos données et votre autonomie sont au cœur de notre démarche. Cette politique explique quelles données nous collectons, pourquoi, et quels sont vos droits.

### Responsable du traitement
NRJKA — [À COMPLÉTER : adresse] — contact@nrjka.com.

### Données que nous collectons
Lorsque vous utilisez le formulaire de contact, nous collectons votre nom et votre adresse e-mail, ainsi que, si vous les renseignez, votre numéro de téléphone, le nom de votre structure et le contenu de votre message.
Nous ne collectons aucune donnée sensible, n'imposons aucune newsletter et ne revendons jamais vos informations.

### Finalités et base légale
Vos données servent uniquement à traiter votre demande et à vous recontacter. La base légale est votre **consentement** (envoi volontaire du formulaire) et notre **intérêt légitime** à répondre à une sollicitation.

### Durée de conservation
Vos données sont conservées le temps nécessaire au traitement de votre demande, puis supprimées ou archivées dans un délai maximal de **3 ans** à compter de notre dernier contact.

### Destinataires et sous-traitants
Vos données sont traitées par NRJKA et par les prestataires techniques strictement nécessaires au fonctionnement du site : Netlify (hébergement), Neon (base de données) et Cloudflare (stockage et diffusion). Nos automatisations internes reposent sur n8n, que nous auto-hébergeons. Aucune donnée n'est transmise à des fins publicitaires.

### Vos droits
Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour les exercer, écrivez-nous à contact@nrjka.com.
Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).

### Cookies
Le site n'utilise que les cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de traçage tiers n'est déposé sans votre consentement.

### Mise à jour
Cette politique peut être mise à jour. La date de dernière modification fait foi — [À COMPLÉTER : date].`

const pages = [
  { slug: 'mentions-legales', title: 'Mentions légales', text: mentions },
  { slug: 'confidentialite', title: 'Politique de confidentialité', text: confidentialite },
]

const run = async () => {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const toLex = (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })

  for (const p of pages) {
    const data: any = {
      title: p.title,
      slug: p.slug,
      _status: 'published',
      hero: { type: 'none' },
      layout: [
        {
          blockType: 'content',
          columns: [{ size: 'full', enableLink: false, richText: toLex(p.text) }],
        },
      ],
    }

    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: p.slug } },
      limit: 1,
      pagination: false,
    })

    if (existing.docs[0]) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
      payload.logger.info(`↻ Page mise à jour : ${p.slug}`)
    } else {
      await payload.create({ collection: 'pages', data })
      payload.logger.info(`✅ Page créée : ${p.slug}`)
    }
  }

  // Ajoute les liens légaux au footer (sans écraser l'existant)
  const footer: any = await payload.findGlobal({ slug: 'footer' })
  const items: any[] = footer?.navItems || []
  const have = new Set(items.map((i) => i?.link?.url))
  const legal = [
    { url: '/mentions-legales', label: 'Mentions légales' },
    { url: '/confidentialite', label: 'Confidentialité' },
  ]
  for (const l of legal) {
    if (!have.has(l.url)) {
      items.push({ link: { type: 'custom', url: l.url, label: l.label, newTab: false } })
    }
  }
  await payload.updateGlobal({ slug: 'footer', data: { navItems: items } })
  payload.logger.info('✅ Footer : liens légaux ajoutés.')

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
