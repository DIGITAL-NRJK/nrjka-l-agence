import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

import { seedExpertises } from '@/scripts/seed-expertises'
import { seedServicesContent } from '@/scripts/seed-services-content'
import { seedPilotMaintenance } from '@/scripts/seed-pilot-maintenance'
import { seedBlog } from '@/scripts/seed-blog'
import { seedAbout } from '@/scripts/seed-about'
import { seedLegal } from '@/scripts/seed-legal'
import { seedContent } from '@/scripts/seed-content'
import { seedResources } from '@/scripts/seed-resources'
import { seedMegamenu } from '@/scripts/seed-megamenu'

// Route TEMPORAIRE de seed global (dev uniquement). Idempotente.
export const dynamic = 'force-dynamic'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Route de seed désactivée en production.' }, { status: 403 })
  }
  const out: Record<string, unknown> = {}
  try {
    const payload = await getPayload({ config: configPromise })
    out.expertises = await seedExpertises(payload) // pôles + services (dont Studio) + besoins
    out.servicesContent = await seedServicesContent(payload) // contenu des services
    out.pilotMaintenance = await seedPilotMaintenance(payload) // maintenance + articles
    out.blog = await seedBlog(payload) // catégories + assignation
    out.about = await seedAbout(payload) // page À propos
    out.legal = await seedLegal(payload) // pages légales
    out.content = await seedContent(payload) // engagements + FAQ home/contact
    out.resources = await seedResources(payload) // ressources gratuites + produits (page /ressources)
    out.megamenu = await seedMegamenu(payload) // pré-remplit le méga-menu manuel (si vide)
    return NextResponse.json({ ok: true, ...out })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err), partial: out },
      { status: 500 },
    )
  }
}
