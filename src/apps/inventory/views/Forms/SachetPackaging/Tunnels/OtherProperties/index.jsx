import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Spacer, Toggle, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { Separator, TunnelContainer } from '../../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'
import { UPDATE_PACKAGING_SPECS } from '../../../../../graphql'

function errorHandler(error) {
   logger(error)
   toast.error(GENERAL_ERROR_MESSAGE)
}

// Props<{state: Packaging.packagingSpecification}>
export default function OtherProperties({ close, state }) {
   const [recycled, setRecycled] = useState(state.recycled)
   const [opacity, setOpacity] = useState(state.opacity || '')
   const [compressibility, setCompressibility] = useState(state.compressibility)

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
               recycled,
               opacity,
               compressibility,
            },
         },
      })
   }

   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title="Configure Other Properties"
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <Flex margin="0 auto">
               <Toggle
                  checked={recycled}
                  label="Recycled"
                  setChecked={() => setRecycled(!recycled)}
               />
               <Spacer size="16px" />
               <Toggle
                  checked={compressibility}
                  label="Compressable"
                  setChecked={() => setCompressibility(!compressibility)}
               />

               <Separator />

               <Form.Group>
                  <Form.Label htmlFor="opacity" title="opacity">
                     Opacity
                  </Form.Label>
                  <Form.Text
                     id="opacity"
                     name="opacity"
                     placeholder="Opacity"
                     value={opacity}
                     onChange={e => setOpacity(e.target.value)}
                  />
               </Form.Group>
            </Flex>
         </TunnelContainer>
      </>
   )
}
