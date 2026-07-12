import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Slugs EN traduits (tâche #13, script seed-en-slugs) : les URLs EN qui étaient
  // le miroir du FR redirigent en 301 vers leur slug anglais définitif.
  const enSlugRedirects = [
    ['a-propos', 'about'],
    ['mentions-legales', 'legal-notice'],
    ['confidentialite', 'privacy'],
    ['accessibilite', 'accessibility'],
    ['ressources', 'resources'],
    ['expertises/marque-contenu', 'expertises/brand-content'],
    ['expertises/performance-visibilite', 'expertises/performance-visibility'],
    ['expertises/digitalisation-process', 'expertises/digitalization-process'],
  ].map(([from, to]) => ({
    source: `/en/${from}`,
    destination: `/en/${to}`,
    permanent: true,
  }))

  return [internetExplorerRedirect, ...enSlugRedirects]
}
