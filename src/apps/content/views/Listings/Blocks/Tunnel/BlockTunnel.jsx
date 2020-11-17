import React from 'react'
import { Trans } from 'react-i18next'
import { TunnelHeader, Text, Spacer, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { SolidTile, TunnelBody } from '../../styled'
import { useTabs } from '../../../../context'
import { Tooltip } from '../../../../../../shared/components'
import { randomSuffix } from '../../../../../../shared/utils'

import { INSERT_INFO_FAQ, INSERT_INFO_GRID } from '../../../../graphql'

export const BlockTunnel = ({ closeTunnel }) => {
   const { addTab } = useTabs()
   const [insert_content_faqs_one] = useMutation(INSERT_INFO_FAQ, {
      onCompleted: data => {
         toast.success('Created succesfully!')
         addTab(
            'FAQ',
            `/content/blocks/faq-form/${data.insert_content_faqs_one.id}`
         )
      },
      onError: () => toast.error('Failed to create!'),
   })
   const [insert_content_informationGrid_one] = useMutation(INSERT_INFO_GRID, {
      onCompleted: data => {
         addTab(
            'Information Grid',
            `/content/blocks/grid-form/${data.insert_content_informationGrid_one.id}`
         )
         toast.success('Created succesfully!')
      },
      onError: () => toast.error('Failed to create!'),
   })

   const createGridInfo = () => {
      insert_content_informationGrid_one({
         variables: {
            object: {
               heading: `Heading-${randomSuffix()}`,
               subHeading: `Sub-Heading-${randomSuffix()}`,
               page: '',
               identifier: '',
            },
         },
      })
   }

   const createFAQInfo = () => {
      insert_content_faqs_one({
         variables: {
            object: {
               heading: `Heading-${randomSuffix()}`,
               subHeading: `Sub-Heading-${randomSuffix()}`,
               page: '',
               identifier: '',
            },
         },
      })
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
