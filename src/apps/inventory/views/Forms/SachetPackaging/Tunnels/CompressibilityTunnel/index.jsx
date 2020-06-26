import React, { useState } from 'react'
import { Text, Toggle, Loader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING } from '../../../../../graphql'
import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'

export default function CompressibilityTunnel({ close, state }) {
   const [top, setTop] = useState(state.compressableFrom?.top)
   const [bottom, setBottom] = useState(state.compressableFrom?.bottom)
   const [side1, setSide1] = useState(state.compressableFrom?.side1)
   const [side2, setSide2] = useState(state.compressableFrom?.side2)
   const [side3, setSide3] = useState(state.compressableFrom?.side3)
   const [side4, setSide4] = useState(state.compressableFrom?.side4)

   const [updatePakcaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         toast.info('Information Added')
         close(1)
      },
      onError: error => {
         console.log(error)
         close(1)
         toast.error('Error, Please try again')
      },
   })

   const handleNext = () => {
      updatePakcaging({
         variables: {
            id: state.id,
            object: {
               compressableFrom: {
                  bottom,
                  side1,
                  side2,
                  side3,
                  side4,
                  top,
               },
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select compressibility"
               next={handleNext}
               close={() => close(1)}
               nextAction="Save"
            />

            <Spacer />

            <div style={{ margin: '20px 0px' }}>
               <Text as="subtitle">
                  Ignore the side which is not appicable for the item.
               </Text>
            </div>

            <div style={{ width: '40%' }}>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={top}
                     label="Top"
                     setChecked={() => setTop(!top)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={bottom}
                     label="Bottom"
                     setChecked={() => setBottom(!bottom)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={side1}
                     label="Side 1"
                     setChecked={() => setSide1(!side1)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={side2}
                     label="Side 2"
                     setChecked={() => setSide2(!side2)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={side3}
                     label="Side 3"
                     setChecked={() => setSide3(!side3)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Toggle
                     checked={side4}
                     label="Side 4"
                     setChecked={() => setSide4(!side4)}
                  />
               </div>
            </div>
         </TunnelContainer>
      </>
   )
}
