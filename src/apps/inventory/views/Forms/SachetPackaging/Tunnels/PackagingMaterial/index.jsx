import { useMutation } from '@apollo/react-hooks'
import { Form, Loader, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { TunnelContainer } from '../../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'
import { UPDATE_PACKAGING_SPECS } from '../../../../../graphql'

function errorHandler(error) {
   logger(error)
   toast.error(GENERAL_ERROR_MESSAGE)
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
            <Form.Group>
               <Form.Label
                  htmlFor="packagingMaterial"
                  title="packagingMaterial"
               >
                  Enter Packaging Material
               </Form.Label>
            </Form.Group>
            <Form.Text
               id="packagingMaterial"
               name="packagingMaterial"
               placeholder="Enter Packaging Material"
               value={packagingType}
               onChange={e => setPackagingType(e.target.value)}
            />
         </TunnelContainer>
      </>
   )
}
