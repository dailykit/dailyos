import React, { useState, useContext } from 'react'
import { Text, Toggle, Loader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING } from '../../../../../graphql'
import { SachetPackagingContext } from '../../../../../context'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'

export default function CompressibilityTunnel({ close }) {
   const { sachetPackagingState, sachetPackagingDispatch } = useContext(
      SachetPackagingContext
   )
   const [top, setTop] = useState(false)
   const [bottom, setBottom] = useState(false)
   const [side1, setSide1] = useState(false)
   const [side2, setSide2] = useState(false)
   const [side3, setSide3] = useState(false)
   const [side4, setSide4] = useState(false)

   const [loading, setLoading] = useState(false)

   const [updatePakcaging] = useMutation(UPDATE_PACKAGING)

   const handleNext = async () => {
      setLoading(true)
      try {
         const resp = await updatePakcaging({
            variables: {
               id: sachetPackagingState.id,
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

         if (resp?.data?.updatePackaging) {
            // succcess updating
            sachetPackagingDispatch({
               type: 'ADD_OPACITY_INFO',
               payload: {
                  bottom,
                  side1,
                  side2,
                  side3,
                  side4,
                  top,
               },
            })
            setLoading(false)
            toast.info('Information Added :)')
            close(6)
         }
      } catch (error) {
         close(6)
         setLoading(false)
         console.log(error)
         toast.error('Errr! I messed something up :(')
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select compressibility"
               next={handleNext}
               close={() => close(6)}
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
