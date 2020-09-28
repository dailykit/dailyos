import { Text, Loader } from '@dailykit/ui'
import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { randomSuffix } from '../../../../../shared/utils/index'
import { Spacer, TunnelContainer, TunnelHeader } from '../../../components'
import { SolidTile } from '../styled'
import { CREATE_PACKAGING } from '../../../graphql'
import { useTabs } from '../../../context'

export default function WorkOrderTypeTunnel({ close }) {
   const { addTab } = useTabs()

   const [createPackaging, { loading }] = useMutation(CREATE_PACKAGING, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
      onCompleted: input => {
         const { packagingName, id } = input.createPackaging.returning[0]
         addTab(packagingName, `/inventory/packagings/${id}`)
      },
   })

   const createPackagingHandler = type => {
      const packagingName = `pack-${randomSuffix()}`
      createPackaging({
         variables: {
            object: {
               packagingName,
               type,
               packagingSpecification: {
                  data: {
                     compostable: false,
                  },
               },
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title="select type of packaging"
            close={() => {
               close(1)
            }}
            next={() => {
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <SolidTile onClick={() => createPackagingHandler('SACHET_PACKAGE')}>
            <Text as="h1">Sachets</Text>
            <Text as="subtitle">
               Sachets are used for packaging ingredients for a meal kit.
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={() => createPackagingHandler('ASSEMBLY_PACKAGE')}>
            <Text as="h1">Assembly Packet</Text>
            <Text as="subtitle">
               Assembly packet is used to assemble all the sacheted ingredients
               into one kit.
            </Text>
         </SolidTile>
      </TunnelContainer>
   )
}
