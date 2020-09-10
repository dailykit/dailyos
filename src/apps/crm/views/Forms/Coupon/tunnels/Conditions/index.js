import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, TextButton, Text } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { UPDATE_COUPON } from '../../../../../graphql'
import { StyledRow, TunnelBody, StyledDiv } from '../styled'

const DescriptionTunnel = ({ state, close }) => {
   const [busy, setBusy] = React.useState(false)
   const [conditions, setConditions] = React.useState(state.conditons || '')
   const [isAll, setIsAll] = useState(true)
   // Mutations
   const [updateProduct] = useMutation(UPDATE_COUPON, {
      variables: {
         id: state.id,
         set: {
            conditions,
         },
      },
      onCompleted: () => {
         toast.success('Updated!')
         close(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      updateProduct()
   }

   return (
      <>
         <TunnelHeader
            title="Add Coupon's Conditions"
            right={{
               action: save,
               title: busy ? 'Saving' : 'Save',
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <StyledRow>
               <Text as="subtitle">
                  Whether All or Any Condition should be matched{' '}
               </Text>
               <span>
                  <TextButton
                     type={isAll ? 'solid' : 'outline'}
                     onClick={() => setIsAll(true)}
                  >
                     ALL
                  </TextButton>
                  <TextButton
                     type={isAll ? 'outline' : 'solid'}
                     onClick={() => setIsAll(false)}
                  >
                     ANY
                  </TextButton>
               </span>
               <StyledDiv>
                  <TextButton type="outline">Add Fact</TextButton>
                  <p className="addFact">+ Add more conditions</p>
               </StyledDiv>
            </StyledRow>
         </TunnelBody>
      </>
   )
}

export default DescriptionTunnel
