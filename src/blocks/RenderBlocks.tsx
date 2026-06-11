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
                <div className="my-16" key={index}>
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
