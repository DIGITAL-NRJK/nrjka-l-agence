import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'

export type PopupData = {
  id: string
  template: 'modal' | 'banner-bottom' | 'slide-in' | 'top-bar'
  heading: string
  body: string
  imageUrl: string | null
  ctaLabel: string
  ctaUrl: string
  dismissible: boolean
  trigger: 'load' | 'scroll' | 'exit'
  delaySeconds: number
  scrollPercent: number
  frequency: 'session' | 'once' | 'always'
  showOn: 'all' | 'include' | 'exclude'
  paths: string[]
  priority: number
}

/**
 * Charge côté serveur les pop-ups actives pour une langue :
 * activées, dans la fenêtre de dates, ciblant « toutes » ou la langue courante.
 * Repli silencieux sur [] (collection pas encore migrée, etc.).
 * Résultat mis en cache 60 s (tag « popups ») — invalidé au changement en admin.
 */
export function getActivePopups(locale: string): Promise<PopupData[]> {
  return unstable_cache(() => fetchActivePopups(locale), ['active-popups', locale], {
    revalidate: 60,
    tags: ['popups', `popups_${locale}`],
  })()
}

async function fetchActivePopups(locale: string): Promise<PopupData[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    // Types Payload pas encore régénérés pour « popups » → accès souple.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (payload as any).find({
      collection: 'popups',
      locale,
      depth: 1,
      limit: 20,
      pagination: false,
      overrideAccess: true,
      where: {
        enabled: { equals: true },
        or: [{ localeFilter: { equals: 'all' } }, { localeFilter: { equals: locale } }],
      },
    })

    const now = Date.now()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((res?.docs || []) as any[])
      .filter((d) => {
        const start = d.startDate ? new Date(d.startDate).getTime() : null
        const end = d.endDate ? new Date(d.endDate).getTime() : null
        if (start && now < start) return false
        if (end && now > end) return false
        return true
      })
      .map((d) => ({
        id: String(d.id),
        template: d.template || 'modal',
        heading: d.heading || '',
        body: d.body || '',
        imageUrl: d.image && typeof d.image === 'object' ? d.image.url || null : null,
        ctaLabel: d.ctaLabel || '',
        ctaUrl: d.ctaUrl || '',
        dismissible: d.dismissible !== false,
        trigger: d.trigger || 'load',
        delaySeconds: typeof d.delaySeconds === 'number' ? d.delaySeconds : 3,
        scrollPercent: typeof d.scrollPercent === 'number' ? d.scrollPercent : 40,
        frequency: d.frequency || 'session',
        showOn: d.showOn || 'all',
        paths: Array.isArray(d.paths)
          ? d.paths.map((p: { path?: string }) => p?.path).filter(Boolean)
          : [],
        priority: typeof d.priority === 'number' ? d.priority : 0,
      }))
      .sort((a, b) => b.priority - a.priority) as PopupData[]
  } catch {
    return []
  }
}
