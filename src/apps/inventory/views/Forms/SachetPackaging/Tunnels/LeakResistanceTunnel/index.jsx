import React, { useState } from 'react'
import { Text, Toggle, Loader, TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING } from '../../../../../graphql'
import { TunnelContainer } from '../../../../../components'

export default function LeakResistanceTunnel({ close, state }) {
   const [liquids, setLiquids] = useState(state.leakResistance?.liquids)
   const [powderedParticles, setPowParticles] = useState(
      state.leakResistance?.powderedParticles
   )

   const [updatePakcaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         toast.info('Information Added :)')
         close(1)
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(1)
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
         <TunnelHeader
            title="Select leak resistance"
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
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
