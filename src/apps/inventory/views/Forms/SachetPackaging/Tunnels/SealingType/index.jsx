import React, { useState, useContext } from 'react'
import { Text, Input, Loader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING } from '../../../../../graphql'
import { SachetPackagingContext } from '../../../../../context'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'

export default function SealingTypeTunnel({ close }) {
   const { sachetPackagingState, sachetPackagingDispatch } = useContext(
      SachetPackagingContext
   )

   const [loading, setLoading] = useState(false)
   const [sealingType, setSealingType] = useState('')

   const [updatePakcaging] = useMutation(UPDATE_PACKAGING)

   const handleNext = async () => {
      setLoading(true)
      try {
         const resp = await updatePakcaging({
            variables: {
               id: sachetPackagingState.id,
               object: {
                  sealingType,
               },
            },
         })

         if (resp?.data?.updatePackaging) {
            // succcess updating
            sachetPackagingDispatch({
               type: 'ADD_SEALING_TYPE',
               payload: sealingType,
            })
            setLoading(false)
            toast.info('Information Added :)')
            close(8)
         }
      } catch (error) {
         close(8)
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
               title="Select leak resistance"
               next={handleNext}
               close={() => close(8)}
               nextAction="Next"
            />

            <Spacer />

            <Text as="title">Enter Sealing type</Text>
            <br />

            <div style={{ width: '40%' }}>
               <Input
                  type="text"
                  name="sealing type"
                  label="Sealing Type"
                  value={sealingType}
                  onChange={e => setSealingType(e.target.value)}
               />
            </div>
         </TunnelContainer>
      </>
   )
}
