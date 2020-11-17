import React from 'react'
import { Trans } from 'react-i18next'
import { TunnelHeader, Text, Spacer, Flex } from '@dailykit/ui'
import { SolidTile, TunnelBody } from '../../styled'
import { useTabs } from '../../../../context'
import { Tooltip } from '../../../../../../shared/components'
import { randomSuffix } from '../../../../../../shared/utils'

export const BlockTunnel = ({ closeTunnel }) => {
   const { addTab } = useTabs()

   const createGridInfo = () => {
      addTab(
         `information_grid${randomSuffix()}`,
         `/content/blocks/grid-form/${`information_grid${randomSuffix()}`}`
      )
   }

   const createFAQInfo = () => {
      addTab(
         `faqs${randomSuffix()}`,
         `/content/blocks/faq-form/${`faqs${randomSuffix()}`}`
      )
   }

   return (
      <>
         <Flex container alignItems="center">
            <TunnelHeader
               title="Add Block"
               close={() => closeTunnel(1)}
               tooltip={<Tooltip identifier="Content_Block_type" />}
            />
         </Flex>
         <TunnelBody>
            <SolidTile onClick={createGridInfo}>
               <Text as="h2">Information Grid</Text>
               <Text as="subtitle">
                  <Trans>Create a new Information Grid </Trans>
               </Text>
            </SolidTile>
            <Spacer size="15px" />
            <SolidTile onClick={createFAQInfo}>
               <Text as="h2">FAQS</Text>
               <Text as="subtitle">
                  <Trans>Create a new FAQ </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}
