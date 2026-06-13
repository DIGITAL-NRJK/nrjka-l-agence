import type { Block } from 'payload'
import { appearance } from '@/fields/appearance'

export const CaseStudiesIndex: Block = {
  slug: 'caseStudiesIndex',
  interfaceName: 'CaseStudiesIndexBlock',
  labels: {
    singular: 'Liste des réalisations',
    plural: 'Liste des réalisations',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    appearance,
  ],
}
