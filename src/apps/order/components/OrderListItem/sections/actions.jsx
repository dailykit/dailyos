import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { Flex, Text, Spacer, TextButton } from '@dailykit/ui'

import { MUTATIONS } from '../../../graphql'
import { logger } from '../../../../../shared/utils'

export const Actions = ({ order }) => {
   const [updateOrder] = useMutation(MUTATIONS.ORDER.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the order!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the order')
      },
   })
   return (
      <Flex
         as="aside"
         padding="0 14px"
         style={{
            borderLeft: '1px solid #ececec',
         }}
      >
         <Text as="h3">Actions</Text>
         <Spacer size="16px" />
         <Flex>
            <TextButton
               type="solid"
               disabled={order.isAccepted}
               onClick={() =>
                  updateOrder({
                     variables: {
                        id: order.id,
                        _set: {
                           isAccepted: true,
                           ...(order.isRejected && { isRejected: false }),
                        },
                     },
                  })
               }
            >
               {order.isAccepted ? 'Accepted' : 'Accept'}
            </TextButton>
            <Spacer size="14px" />
            <TextButton
               type="ghost"
               onClick={() =>
                  updateOrder({
                     variables: {
                        id: order.id,
                        _set: {
                           isRejected: !order.isRejected,
                        },
                     },
                  })
               }
            >
               {order.isRejected ? 'Un Reject' : 'Reject'}
            </TextButton>
         </Flex>
      </Flex>
   )
}
