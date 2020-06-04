import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Loader, Toggle, Text, TextButton } from '@dailykit/ui'
import { toast } from 'react-toastify'

import { UPDATE_PACKAGING } from '../../../graphql'
import { Spacer } from '../../../components'
import { FlexContainer, ShadowCard } from '../styled'

export default function AdditionalInfo({ state }) {
   const [innWaterRes, setInnWaterRes] = useState(state.innWaterRes)
   const [heatSafe, setHeatSafe] = useState(state.heatSafe)
   const [outWaterRes, setOutWaterRes] = useState(state.outWaterRes)
   const [recyclable, setRecyclable] = useState(state.recyclable)
   const [compostable, setCompostable] = useState(state.compostable)
   const [fdaComp, setFdaComp] = useState(state.fdaComp)
   const [innGreaseRes, setInnGreaseRes] = useState(state.innGreaseRes)
   const [outGreaseRes, setOutGreaseRes] = useState(state.outGreaseRes)

   const [loading, setLoading] = useState(false)

   const [updatePackaging] = useMutation(UPDATE_PACKAGING)

   const handleSave = async () => {
      try {
         setLoading(true)
         const resp = await updatePackaging({
            variables: {
               id: state.id,
               object: {
                  innWaterRes,
                  heatSafe,
                  outWaterRes,
                  recyclable,
                  compostable,
                  fdaComp,
                  innGreaseRes,
                  outGreaseRes,
               },
            },
         })

         if (resp?.data?.updatePackaging) {
            setLoading(false)
            toast.info('Information added :)')
         }
      } catch (error) {
         setLoading(false)
         console.log(error)
         toast.error('Error, Please try again')
      }
   }

   if (loading) return <Loader />

   return (
      <ShadowCard style={{ flexDirection: 'column' }}>
         <FlexContainer
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
         >
            <Text as="title">Additional Information</Text>

            <TextButton type="solid" onClick={handleSave}>
               Save
            </TextButton>
         </FlexContainer>
         <Spacer />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={innWaterRes}
               label="Inner Water Resistant"
               setChecked={() => setInnWaterRes(!innWaterRes)}
            />

            <Toggle
               checked={heatSafe}
               label="Heat Safe"
               setChecked={() => setHeatSafe(!heatSafe)}
            />
         </FlexContainer>
         <br />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={outWaterRes}
               label="Outer Water Resistant"
               setChecked={() => setOutWaterRes(!outWaterRes)}
            />

            <Toggle
               checked={recyclable}
               label="Recyclable"
               setChecked={() => setRecyclable(!recyclable)}
            />
         </FlexContainer>
         <br />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={innGreaseRes}
               label="Inner Grease Resistant"
               setChecked={() => setInnGreaseRes(!innGreaseRes)}
            />

            <Toggle
               checked={compostable}
               label="Compostable"
               setChecked={() => setCompostable(!compostable)}
            />
         </FlexContainer>
         <br />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={outGreaseRes}
               label="Outer Grease Resistant"
               setChecked={() => setOutGreaseRes(!outGreaseRes)}
            />

            <Toggle
               checked={fdaComp}
               label="FDA compliant"
               setChecked={() => setFdaComp(!fdaComp)}
            />
         </FlexContainer>
      </ShadowCard>
   )
}
