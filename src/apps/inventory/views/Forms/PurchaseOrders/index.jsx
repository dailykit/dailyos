import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   Form,
   Loader,
   Spacer,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ErrorState, Tooltip } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils/errorLog'
import { ItemCard, Separator, StatusSwitch } from '../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import {
   PURCHASE_ORDER_SUBSCRIPTION,
   UPDATE_PURCHASE_ORDER_ITEM,
} from '../../../graphql'
import { StyledWrapper } from '../styled'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'

const address = 'apps.inventory.views.forms.purchaseorders.'

function onError(error) {
   logger(error)
   toast.error(GENERAL_ERROR_MESSAGE)
}

export default function PurchaseOrderForm() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { id } = useParams()

   const [orderQuantity, setOrderQuantity] = useState(0)

   const {
      data: { purchaseOrderItem: state = {} } = {},
      loading: orderLoading,
      error,
   } = useSubscription(PURCHASE_ORDER_SUBSCRIPTION, {
      variables: { id },
      onSubscriptionData: data => {
         setOrderQuantity(
            data.subscriptionData.data?.purchaseOrderItem.orderQuantity
         )
      },
   })
   const [updatePurchaseOrder] = useMutation(UPDATE_PURCHASE_ORDER_ITEM, {
      onError,
      onCompleted: () => {
         toast.success('Purchase Order updated!')
      },
   })

   const editable = ['PENDING', 'UNPUBLISHED'].includes(state.status)

   const checkForm = () => {
      if (!state.supplierItem?.id) {
         toast.error('No Supplier Item selecetd!')
         return false
      }
      if (editable && !orderQuantity) {
         toast.error('Please provide order quantity!')
         return false
      }

      return true
   }

   const saveStatus = status => {
      const isValid = checkForm()

      if (isValid) {
         updatePurchaseOrder({ variables: { id: state.id, set: { status } } })
      }
      // TODO: show error message
   }

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (orderLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectSupplierItemTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <Flex
               container
               alignItems="center"
               justifyContent="space-between"
               padding="16px 0"
            >
               <Text as="h1">{t(address.concat('purchase order'))}</Text>

               {state.status === 'UNPUBLISHED' ? (
                  <TextButton
                     type="solid"
                     onClick={() => saveStatus('PENDING')}
                  >
                     Publish
                  </TextButton>
               ) : (
                  <StatusSwitch
                     currentStatus={state.status}
                     onSave={saveStatus}
                  />
               )}
            </Flex>

            <Text as="title">{t(address.concat('supplier item'))}</Text>
            {state.supplierItem?.name ? (
               <>
                  {!editable ? (
                     <ItemCard
                        title={state.supplierItem.name}
                        onHand={state.supplierItem?.bulkItemAsShipped?.onHand}
                     />
                  ) : (
                     <ItemCard
                        title={state.supplierItem.name}
                        onHand={state.supplierItem?.bulkItemAsShipped?.onHand}
                        edit={() => openTunnel(1)}
                     />
                  )}
                  <Separator />

                  <Flex container alignItems="flex-end">
                     <Form.Group>
                        <Form.Label htmlFor="quantity" title="quantity">
                           <Flex container alignItems="center">
                              {t(address.concat('enter order quantity'))}

                              <Tooltip identifier="purchase_order_form_order_quantity" />
                           </Flex>
                        </Form.Label>

                        <Form.Number
                           id="quantity"
                           name="quantity"
                           hasWriteAccess={editable}
                           value={orderQuantity}
                           placeholder={t(
                              address.concat('enter order quantity')
                           )}
                           onChange={e => {
                              setOrderQuantity(e.target.value)
                           }}
                           onBlur={e => {
                              updatePurchaseOrder({
                                 variables: {
                                    id: state.id,
                                    set: {
                                       orderQuantity: +e.target.value || 0,
                                    },
                                 },
                              })
                           }}
                        />
                     </Form.Group>

                     <Spacer xAxis size="8px" />

                     <Text as="title">
                        (in{' '}
                        {state.supplierItem?.bulkItemAsShipped?.unit ||
                           state?.unit ||
                           'N/A'}
                        )
                     </Text>
                  </Flex>
               </>
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select supplier item'))}
                  onClick={() => openTunnel(1)}
                  style={{ margin: '20px 0' }}
               />
            )}
         </StyledWrapper>
      </>
   )
}
