import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { ButtonTile, Flex, useTunnel, Text, ComboButton } from '@dailykit/ui'
import { UPDATE_COUPON } from '../../../../../graphql'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import Conditions from '../../../../../../../shared/components/Conditions'
import { logger } from '../../../../../../../shared/utils'
import { Tooltip } from '../../../../../../../shared/components'
import { StyledContainer } from './styled'

const ConditionComp = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Mutation
   const [updateCoupon] = useMutation(UPDATE_COUPON, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong')
         closeTunnel(1)
         logger(error)
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
               <Flex
                  container
                  justifyContent="space-between"
                  margin="0 0 16px 0"
               >
                  <Flex container alignItems="center">
                     <Text as="title">Coupon Condition</Text>
                     <Tooltip identifier="coupon_condition" />
                  </Flex>
                  <ComboButton
                     type="outline"
                     size="sm"
                     onClick={() => openTunnel(1)}
                  >
                     <EditIcon color="#00a7e1" />
                     View/Edit
                  </ComboButton>
               </Flex>
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
