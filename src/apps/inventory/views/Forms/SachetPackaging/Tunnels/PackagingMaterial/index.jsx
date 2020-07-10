import React, { useState } from 'react'
import { Text, Input, Loader, TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING } from '../../../../../graphql'

import { TunnelContainer } from '../../../../../components'

export default function PackagingTypeTunnel({ close, state }) {
   const [loading, setLoading] = useState(false)
   const [packagingType, setPackagingType] = useState(state.packagingType || '')

   const [updatePakcaging] = useMutation(UPDATE_PACKAGING, {
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(1)
      },
      onCompleted: () => {
         setLoading(false)
         toast.info('Information Added :)')
         close(1)
      },
   })

   const handleNext = () => {
      updatePakcaging({
         variables: {
            id: state.id,
            object: {
               packagingType,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Select leak resistance"
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <Text as="title">Enter Packaging type</Text>
            <br />

            <div style={{ width: '40%' }}>
               <Input
                  type="text"
                  name="packaging type"
                  label="Enter Packaging Type"
                  value={packagingType}
                  onChange={e => setPackagingType(e.target.value)}
               />
            </div>
         </TunnelContainer>
      </>
   )
}
