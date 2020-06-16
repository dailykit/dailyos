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

export default function LeakResistanceTunnel({ close, state }) {
   const [liquids, setLiquids] = useState(state.leakResistance?.liquids)
   const [powderedParticles, setPowParticles] = useState(
      state.leakResistance?.powderedParticles
   )

   const [updatePakcaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         toast.info('Information Added :)')
         close(4)
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(4)
      },
   })

   const handleNext = () => {
      updatePakcaging({
         variables: {
            id: state.id,
            object: {
               leakResistance: {
                  liquids,
                  powderedParticles,
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
