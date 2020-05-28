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

export default function PackagingTypeTunnel({ close }) {
   const { sachetPackagingState, sachetPackagingDispatch } = useContext(
      SachetPackagingContext
   )

   const [loading, setLoading] = useState(false)
   const [packagingType, setPackagingType] = useState('')

   const [updatePakcaging] = useMutation(UPDATE_PACKAGING)

   const handleNext = async () => {
      setLoading(true)
      try {
         const resp = await updatePakcaging({
            variables: {
               id: sachetPackagingState.id,
               object: {
                  packagingType,
               },
            },
         })

         if (resp?.data?.updatePackaging) {
            // succcess updating
            sachetPackagingDispatch({
               type: 'ADD_PACKAGING_TYPE',
               payload: setPackagingType,
            })
            setLoading(false)
            toast.info('Information Added :)')
            close(7)
         }
      } catch (error) {
         close(7)
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
               close={() => close(7)}
               nextAction="Next"
            />

            <Spacer />

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
