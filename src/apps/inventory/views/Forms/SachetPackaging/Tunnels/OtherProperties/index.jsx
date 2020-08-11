import React, { useState } from 'react'
import { Input, Toggle, Loader, TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING_SPECS } from '../../../../../graphql'
import { TunnelContainer } from '../../../../../components'

function errorHandler(error) {
   console.log(error)
   toast.error(error.message)
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

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Configure Other Properties"
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <div style={{ width: '40%' }}>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={recycled}
                     label="Recycled"
                     setChecked={() => setRecycled(!recycled)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={compressibility}
                     label="Compressable"
                     setChecked={() => setCompressibility(!compressibility)}
                  />
               </div>

               <div style={{ marginBottom: '30px' }}>
                  <Input
                     type="text"
                     label="Opacity"
                     value={opacity}
                     onChange={e => setOpacity(e.target.value)}
                  />
               </div>
            </div>
         </TunnelContainer>
      </>
   )
}
