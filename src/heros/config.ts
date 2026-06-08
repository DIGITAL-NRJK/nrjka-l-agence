import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
 {
          label: 'Accueil NRJKA',
          value: 'homeNRJKA',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'headlineAccent',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type === 'homeNRJKA',
        description: 'Segment affiché en dégradé, à la suite du titre.',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'primaryCtaHref',
      type: 'text',
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'secondaryCtaHref',
      type: 'text',
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
    },
    {
      name: 'trustBadges',
      type: 'array',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
      fields: [{ name: 'label', type: 'text' }],
    },
    {
      name: 'stats',
      type: 'array',
      localized: true,
      admin: { condition: (_, { type } = {}) => type === 'homeNRJKA' },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
  ],
  label: false,
}
