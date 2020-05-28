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

export default function LeakResistanceTunnel({ close }) {
   const { sachetPackagingState, sachetPackagingDispatch } = useContext(
      SachetPackagingContext
   )
   const [liquids, setLiquids] = useState(
      sachetPackagingState.leakResistance.liquids
   )
   const [powderedParticles, setPowParticles] = useState(
      sachetPackagingState.leakResistance.powderedParticles
   )

   const [loading, setLoading] = useState(false)

   const [updatePakcaging] = useMutation(UPDATE_PACKAGING)

   const handleNext = async () => {
      setLoading(true)
      try {
         const resp = await updatePakcaging({
            variables: {
               id: sachetPackagingState.id,
               object: {
                  leakResistance: {
                     liquids,
                     powderedParticles,
                  },
               },
            },
         })

         if (resp?.data?.updatePackaging) {
            // succcess updating
            sachetPackagingDispatch({
               type: 'ADD_LEAK_RESISTANCE_INFO',
               payload: {
                  liquids,
                  powderedParticles,
               },
            })
            setLoading(false)
            toast.info('Information Added :)')
            close(4)
         }
      } catch (error) {
         close(4)
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
               close={() => close(4)}
               nextAction="Next"
            />

            <Spacer />

            <Text as="title">Safe for:</Text>
            <br />

            <div style={{ width: '40%' }}>
               <Toggle
                  checked={liquids}
                  label="Liquids"
                  setChecked={() => setLiquids(!liquids)}
               />
               <br />
               <Toggle
                  checked={powderedParticles}
                  label="Powdered particles"
                  setChecked={() => setPowParticles(!powderedParticles)}
               />
            </div>
         </TunnelContainer>
      </>
   )
}
