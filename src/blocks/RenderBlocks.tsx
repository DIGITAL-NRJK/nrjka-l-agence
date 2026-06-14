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
}
// Rythme vertical de la home : les sections liées sont rapprochées,
// chaque nouveau « mouvement » respire davantage.
// Les blocs absents de cette liste (pages standard) gardent my-16.
const blockSpacing: Record<string, string> = {
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
}> = (props) => {
  const { blocks } = props

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
                  <Block {...block} disableInnerContainer />
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
