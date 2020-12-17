import React from 'react'
import { toast } from 'react-toastify'
import usePortal from 'react-useportal'
import { useMutation } from '@apollo/react-hooks'
import {
   Flex,
   Text,
   Spacer,
   TextButton,
   Popup,
   ButtonGroup,
} from '@dailykit/ui'

import { MUTATIONS } from '../../../graphql'
import { logger } from '../../../../../shared/utils'

export const Actions = ({ order }) => {
   const { openPortal, closePortal, isOpen, Portal } = usePortal({
      bindTo: document && document.getElementById('popups'),
   })
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
            <TextButton type="ghost" onClick={openPortal}>
               {order.isRejected ? 'Un Reject' : 'Reject'}
            </TextButton>
         </Flex>
         <Portal>
            <Popup show={isOpen}>
               <Popup.Text type="danger">
                  {order.thirdPartyOrderId
                     ? `${
                          order.isRejected ? 'Unrejecting' : 'Rejecting'
                       } a third party order would not ${
                          order.isRejected ? 'unreject' : 'reject'
                       } the order from said third party app. Are you sure you want to ${
                          order.isRejected ? 'unreject' : 'reject'
                       } this order?`
                     : `Are you sure you want to ${
                          order.isRejected ? 'unreject' : 'reject'
                       } this order?`}
               </Popup.Text>
               <Popup.Actions>
                  <ButtonGroup align="left">
                     <TextButton
                        type="solid"
                        onClick={e => {
                           closePortal(e)
                           updateOrder({
                              variables: {
                                 id: order.id,
                                 _set: {
                                    isRejected: !order.isRejected,
                                 },
                              },
                           })
                        }}
                     >
                        {order.isRejected ? 'Un Reject' : 'Reject'}
                     </TextButton>
                     <TextButton type="ghost" onClick={closePortal}>
                        Close
                     </TextButton>
                  </ButtonGroup>
               </Popup.Actions>
            </Popup>
         </Portal>
      </Flex>
   )
}
