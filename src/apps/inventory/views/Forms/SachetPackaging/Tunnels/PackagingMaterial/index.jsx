import React, { useState } from 'react'
import { Text, Input, Loader, TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING_SPECS } from '../../../../../graphql'

import { TunnelContainer } from '../../../../../components'

function errorHandler(error) {
   console.log(error)
   toast.error(error.message)
}

export default function PackagingTypeTunnel({ close, state }) {
   const [packagingType, setPackagingType] = useState(state.packagingType || '')

   const [updateSpecs, { loading }] = useMutation(UPDATE_PACKAGING_SPECS, {
      onError: errorHandler,
      onCompleted: () => {
         toast.success('Package Specification updated!')
         close(1)
      },
   })

   const handleNext = () => {
      updateSpecs({
         variables: {
            id: state.id,
            object: {
               packagingMaterial: packagingType,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Configure Packaging Material"
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <Text as="title">Enter Packaging type</Text>
            <br />

            <div style={{ width: '40%' }}>
               <Input
                  type="text"
                  name="packaging material"
                  label="Enter Packaging Material"
                  value={packagingType}
                  onChange={e => setPackagingType(e.target.value)}
               />
            </div>
         </TunnelContainer>
      </>
   )
}
