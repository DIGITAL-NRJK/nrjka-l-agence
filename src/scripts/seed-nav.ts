/**
 * Pré-remplit la navigation des globals Header et Footer.
 * Lancement : pnpm payload run src/scripts/seed-nav.ts
 * Les liens restent entièrement éditables ensuite dans l'admin.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const headerItems = [
  { link: { type: 'custom' as const, url: '/', label: 'Accueil', newTab: false } },
  { link: { type: 'custom' as const, url: '/contact', label: 'Contact', newTab: false } },
]

// Le footer reprend les mêmes liens ; on y ajoutera Mentions légales / Confidentialité
// dès que ces pages existeront.
const footerItems = [
  { link: { type: 'custom' as const, url: '/', label: 'Accueil', newTab: false } },
  { link: { type: 'custom' as const, url: '/contact', label: 'Contact', newTab: false } },
]

const run = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({ slug: 'header', data: { navItems: headerItems } })
  await payload.updateGlobal({ slug: 'footer', data: { navItems: footerItems } })

  payload.logger.info('✅ Navigation Header + Footer pré-remplie (Accueil, Contact).')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
