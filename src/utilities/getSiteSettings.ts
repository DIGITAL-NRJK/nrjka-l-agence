import type { SiteSetting } from '@/payload-types'

import { getCachedGlobal } from './getGlobals'

// Lecture typée du global « Paramètres du site ».
// depth 1 : peuple l'image OG par défaut (upload Media) pour récupérer son URL.
// Repli silencieux sur null : le global peut ne pas encore exister (avant synchro/migration),
// les consommateurs gèrent l'absence avec leurs propres valeurs par défaut.
export const getSiteSettings = async (locale = 'fr'): Promise<SiteSetting | null> => {
  try {
    return (await getCachedGlobal('site-settings', 1, locale)()) as SiteSetting
  } catch {
    return null
  }
}
