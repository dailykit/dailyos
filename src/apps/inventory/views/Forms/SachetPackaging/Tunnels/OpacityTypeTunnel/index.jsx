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

export default function OpacityTypeTunnel({ close }) {
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
                  packOpacity: {
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
               type: 'ADD_COMPRESSABILITY_INFO',
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
            close(5)
         }
      } catch (error) {
         close(5)
         setLoading(false)
         console.log(error)
         toast.error('Error, Please try again')
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select opacity type"
               next={handleNext}
               close={() => close(5)}
               nextAction="Save"
            />

            <Spacer />

            <div style={{ margin: '20px 0px' }}>
               <Text as="subtitle">
                  Ignore the side which is not appicable for the item.
               </Text>
               <Text as="subtitle">
                  Use the toggle to switch between opaque and transparent
                  options
               </Text>
            </div>

            <div style={{ width: '40%' }}>
               <div style={{ marginBottom: '30px' }}>
                  <Text as="title">Top:</Text>
                  <br />
                  <Toggle
                     checked={top}
                     label={top ? 'Transparent' : 'Opaque'}
                     setChecked={() => setTop(!top)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Text as="title">Bottom:</Text>
                  <br />
                  <Toggle
                     checked={bottom}
                     label={bottom ? 'Transparent' : 'Opaque'}
                     setChecked={() => setBottom(!bottom)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Text as="title">Side 1:</Text>
                  <br />
                  <Toggle
                     checked={side1}
                     label={side1 ? 'Transparent' : 'Opaque'}
                     setChecked={() => setSide1(!side1)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Text as="title">Side 2:</Text>
                  <br />
                  <Toggle
                     checked={side2}
                     label={side2 ? 'Transparent' : 'Opaque'}
                     setChecked={() => setSide2(!side2)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Text as="title">Side 3:</Text>
                  <br />
                  <Toggle
                     checked={side3}
                     label={side3 ? 'Transparent' : 'Opaque'}
                     setChecked={() => setSide3(!side3)}
                  />
               </div>
               <div style={{ marginBottom: '30px' }}>
                  <Text as="title">Side 4:</Text>
                  <br />
                  <Toggle
                     checked={side4}
                     label={side4 ? 'Transparent' : 'Opaque'}
                     setChecked={() => setSide4(!side4)}
                  />
               </div>
            </div>
         </TunnelContainer>
      </>
   )
}
