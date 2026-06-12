import type { Block } from 'payload'

export const CtaFinal: Block = {
  slug: 'ctaFinal',
  interfaceName: 'CtaFinalBlock',
  labels: {
    singular: 'CTA final',
    plural: 'CTA final',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'note', type: 'text', localized: true },
    { name: 'primaryCtaLabel', type: 'text', localized: true },
    { name: 'primaryCtaHref', type: 'text' },
    { name: 'secondaryCtaLabel', type: 'text', localized: true },
    { name: 'secondaryCtaHref', type: 'text' },
  ],
}
