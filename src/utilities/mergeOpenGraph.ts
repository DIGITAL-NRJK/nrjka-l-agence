import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Agence web spécialisée en transformation digitale, création de sites, SEO et automatisation. Architecture D4™ — de la complexité à la clarté.',
  images: [
    {
      url: `${getServerSideURL()}/og-nrjka.webp`,
    },
  ],
  siteName: 'NRJKA Digital',
  title: 'NRJKA Digital — Agence web & transformation digitale',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
