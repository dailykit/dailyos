import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Loader, Toggle, Text } from '@dailykit/ui'
import { toast } from 'react-toastify'

import {
   UPDATE_PACKAGING_SPECS,
   PACKAGING_SPECS_SUBSCRIPTION,
} from '../../../graphql'
import { Spacer } from '../../../components'
import { FlexContainer, ShadowCard } from '../styled'

function errorHandler(error) {
   console.log(error)
   toast.error(error.message)
}

export default function AdditionalInfo({ id }) {
   const {
      data: { packaging: { packagingSpecification: spec = {} } = {} } = {},
      loading,
   } = useSubscription(PACKAGING_SPECS_SUBSCRIPTION, {
      variables: { id },
      onError: errorHandler,
   })

   const [updateSpecs] = useMutation(UPDATE_PACKAGING_SPECS, {
      onError: errorHandler,
      onCompleted: () => toast.success('Package Specification updated!'),
   })

   const handleSave = specName => {
      updateSpecs({
         variables: {
            id: spec.id,
            object: {
               [specName]: !spec[specName],
            },
         },
      })
   }

   return loading ? (
      <Loader />
   ) : (
      <ShadowCard style={{ flexDirection: 'column' }}>
         <FlexContainer
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
         >
            <Text as="title">Additional Information</Text>
         </FlexContainer>
         <Spacer />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={spec.innerWaterResistant}
               label="Inner Water Resistant"
               setChecked={() => handleSave('innerWaterResistant')}
            />

            <Toggle
               checked={spec.microwaveable}
               label="Microwaveable"
               setChecked={() => handleSave('microwaveable')}
            />
         </FlexContainer>
         <br />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={spec.outerWaterResistant}
               label="Outer Water Resistant"
               setChecked={() => handleSave('outerWaterResistant')}
            />

            <Toggle
               checked={spec.recyclable}
               label="Recyclable"
               setChecked={() => handleSave('recyclable')}
            />
         </FlexContainer>
         <br />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={spec.innerGreaseResistant}
               label="Inner Grease Resistant"
               setChecked={() => handleSave('innerGreaseResistant')}
            />

            <Toggle
               checked={spec.compostable}
               label="Compostable"
               setChecked={() => handleSave('compostable')}
            />
         </FlexContainer>
         <br />
         <FlexContainer style={{ justifyContent: 'space-between' }}>
            <Toggle
               checked={spec.outerGreaseResistant}
               label="Outer Grease Resistant"
               setChecked={() => handleSave('innerGreaseResistant')}
            />

            <Toggle
               checked={spec.fdaCompliant}
               label="FDA compliant"
               setChecked={() => handleSave('fdaCompliant')}
            />
         </FlexContainer>
      </ShadowCard>
   )
}
