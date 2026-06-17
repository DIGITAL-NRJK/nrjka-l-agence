import type { Block } from 'payload'

import { appearance } from '@/fields/appearance'
import { iconOptions } from '@/utilities/icons'

export const Promise: Block = {
  slug: 'promise',
  interfaceName: 'PromiseBlock',
  labels: {
    singular: 'Promesse',
    plural: 'Promesses',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      localized: true,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'userCheck',
          options: iconOptions,
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'commitment',
      type: 'text',
      localized: true,
    },
    appearance,
  ],
}
