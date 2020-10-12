import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
   Text,
   ComboButton,
} from '@dailykit/ui'
import { UPDATE_COUPON } from '../../../../../graphql'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import Conditions from '../../../../../../../shared/components/Conditions'
import { StyledContainer, StyledRow } from './styled'
const ConditionComp = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Mutation
   const [updateCoupon] = useMutation(UPDATE_COUPON, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error!')
         closeTunnel(1)
      },
   })

   // Handlers
   const saveInfo = conditionId => {
      updateCoupon({
         variables: {
            id: state.id,
            set: {
               visibleConditionId: conditionId,
            },
         },
      })
   }
   return (
      <>
         <Conditions
            id={state.visibleConditionId}
            onSave={id => saveInfo(id)}
            tunnels={tunnels}
            openTunnel={openTunnel}
            closeTunnel={closeTunnel}
         />
         {state.visibleConditionId ? (
            <StyledContainer>
               <Text as="title">Coupon Condition</Text>
               <StyledRow>
                  <ComboButton type="ghost" onClick={() => openTunnel(1)}>
                     View/Edit Conditions
                     <EditIcon color="#00a7e1" />
                  </ComboButton>
               </StyledRow>
            </StyledContainer>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Coupon's Condition"
               style={{ margin: '20px 0' }}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default ConditionComp
