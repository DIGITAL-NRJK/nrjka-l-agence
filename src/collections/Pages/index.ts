import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Promise } from '../../blocks/Promise/config'
import { Pillars } from '../../blocks/Pillars/config'
import { Method } from '../../blocks/Method/config'
import { Lab } from '../../blocks/Lab/config'
import { Commitments } from '../../blocks/Commitments/config'
import { Partners } from '../../blocks/Partners/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { Resources } from '../../blocks/Resources/config'
import { CtaFinal } from '../../blocks/CtaFinal/config'
import { Contact } from '../../blocks/Contact/config'
import { Presence } from '../../blocks/Presence/config'
import { CaseStudiesIndex } from '../../blocks/CaseStudiesIndex/config'
import { Faq } from '../../blocks/Faq/config'
import { AboutHero } from '../../blocks/AboutHero/config'
import { D4Cards } from '../../blocks/D4Cards/config'
import { Distinctions } from '../../blocks/Distinctions/config'
import { StatsBand } from '../../blocks/StatsBand/config'
import { Team } from '../../blocks/Team/config'
import { ResourcesCatalog } from '../../blocks/ResourcesCatalog/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    // Pages = structure du site : réservé aux admins (l'Éditeur ne gère qu'articles + offres d'emploi).
    create: adminOnly,
    delete: adminOnly,
    read: authenticatedOrPublished,
    update: adminOnly,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    description:
      'Les pages du site (accueil, contact, réalisations, expertises, pages légales…), composées de blocs réutilisables. Le slug détermine l’URL — « home » correspond à la page d’accueil.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                Promise,
                Pillars,
                Method,
                Lab,
                Commitments,
                Partners,
                Testimonials,
                Resources,
                CtaFinal,
                Contact,
                Presence,
                CaseStudiesIndex,
                Faq,
                AboutHero,
                D4Cards,
                Distinctions,
                StatsBand,
                Team,
                ResourcesCatalog,
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
