import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PromiseBlock } from '@/blocks/Promise/Component'
import { PillarsBlock } from '@/blocks/Pillars/Component'
import { MethodBlock } from '@/blocks/Method/Component'
import { LabBlock } from '@/blocks/Lab/Component'
import { CommitmentsBlock } from '@/blocks/Commitments/Component'
import { PartnersBlock } from '@/blocks/Partners/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { ResourcesBlock } from '@/blocks/Resources/Component'
import { CtaFinalBlock } from '@/blocks/CtaFinal/Component'
import { ContactBlock } from '@/blocks/Contact/Component'
import { PresenceBlock } from '@/blocks/Presence/Component'
import { CaseStudiesIndexBlock } from '@/blocks/CaseStudiesIndex/Component'
import { FaqBlock } from '@/blocks/Faq/Component'
import { AboutHeroBlock } from '@/blocks/AboutHero/Component'
import { D4CardsBlock } from '@/blocks/D4Cards/Component'
import { DistinctionsBlock } from '@/blocks/Distinctions/Component'
import { StatsBandBlock } from '@/blocks/StatsBand/Component'
import { TeamBlock } from '@/blocks/Team/Component'
import { ResourcesCatalogBlock } from '@/blocks/ResourcesCatalog/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  promise: PromiseBlock,
  pillars: PillarsBlock,
  method: MethodBlock,
  lab: LabBlock,
  commitments: CommitmentsBlock,
  partners: PartnersBlock,
  testimonialsBlock: TestimonialsBlock,
  resourcesBlock: ResourcesBlock,
  ctaFinal: CtaFinalBlock,
  contact: ContactBlock,
  presence: PresenceBlock,
  caseStudiesIndex: CaseStudiesIndexBlock,
  faq: FaqBlock,
  aboutHero: AboutHeroBlock,
  d4Cards: D4CardsBlock,
  distinctions: DistinctionsBlock,
  statsBand: StatsBandBlock,
  team: TeamBlock,
  resourcesCatalog: ResourcesCatalogBlock,
}
// Rythme vertical de la home : les sections liées sont rapprochées,
// chaque nouveau « mouvement » respire davantage.
// Les blocs absents de cette liste (pages standard) gardent my-16.
const blockSpacing: Record<string, string> = {
  aboutHero: 'mb-12 lg:mb-16',
  d4Cards: 'mt-16 lg:mt-20',
  distinctions: 'mt-16 lg:mt-20',
  team: 'mt-16 lg:mt-20',
  statsBand: 'mt-16 lg:mt-20',
  resourcesCatalog: 'mt-12 lg:mt-16',
  promise: 'mt-16 lg:mt-20',
  pillars: 'mt-28 lg:mt-40',
  method: 'mt-20 lg:mt-24',
  lab: 'mt-28 lg:mt-40',
  commitments: 'mt-28 lg:mt-40',
  partners: 'mt-28 lg:mt-40',
  testimonialsBlock: 'mt-28 lg:mt-40',
  resourcesBlock: 'mt-28 lg:mt-40',
  ctaFinal: 'mt-28 lg:mt-40',
}
export const RenderBlocks: React.FC<{
  blocks: Page['layout']
  /** locale active — transmise aux blocs pour préfixer leurs liens internes (évite les 308) */
  locale?: string
}> = (props) => {
  const { blocks, locale = 'fr' } = props

  if (blocks && blocks.length > 0) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={`block-reveal ${blockSpacing[blockType] || 'my-16'}`} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} locale={locale} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
