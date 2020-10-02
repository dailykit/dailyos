import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Input,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ItemCard, Spacer, StatusSwitch } from '../../../components'
import FormHeading from '../../../components/FormHeading'
import {
   PURCHASE_ORDER_SUBSCRIPTION,
   UPDATE_PURCHASE_ORDER_ITEM,
} from '../../../graphql'
import { FormActions, StyledForm, StyledWrapper } from '../styled'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'

const address = 'apps.inventory.views.forms.purchaseorders.'

function onError(error) {
   console.log(error)
   toast.error(error.message)
}

export default function PurchaseOrderForm() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { id } = useParams()

   const [orderQuantity, setOrderQuantity] = useState(0)

   const {
      data: { purchaseOrderItem: state = {} } = {},
      loading: orderLoading,
   } = useSubscription(PURCHASE_ORDER_SUBSCRIPTION, {
      variables: { id },
      onError,
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

   const editable = state.status === 'COMPLETED' || state.status === 'CANCELLED'

   const checkForm = () => {
      if (!state.supplierItem?.id) {
         toast.error('No Supplier Item selecetd!')
         return false
      }
      if (!orderQuantity) {
         toast.error('Please provide orde quantity!')
         return false
      }

      return true
   }

   const saveStatus = status => {
      const isValid = checkForm()

      if (isValid) {
         updatePurchaseOrder({ variables: { id: state.id, set: { status } } })
      } else {
         // state.status is the old status
         updatePurchaseOrder({
            variables: { id: state.id, set: { status: state.status } },
         })
      }
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
            <FormHeading>
               <div
                  style={{
                     width: '30%',
                  }}
               >
                  <Text as="h1">{t(address.concat('purchase order'))}</Text>
               </div>

               <FormActions style={{ position: 'relative' }}>
                  <StatusSwitch
                     currentStatus={state.status}
                     onSave={saveStatus}
                  />
               </FormActions>
            </FormHeading>

            <StyledForm style={{ width: '90%', margin: '0 auto' }}>
               <Text as="title">{t(address.concat('supplier item'))}</Text>
               {state.supplierItem?.name ? (
                  <>
                     {editable ? (
                        <ItemCard
                           title={state.supplierItem.name}
                           onHand={
                              state.supplierItem?.bulkItemAsShipped?.onHand
                           }
                        />
                     ) : (
                        <ItemCard
                           title={state.supplierItem.name}
                           onHand={
                              state.supplierItem?.bulkItemAsShipped?.onHand
                           }
                           edit={() => openTunnel(1)}
                        />
                     )}
                     <Spacer />

                     <div
                        style={{
                           width: '22%',
                           display: 'flex',
                           alignItems: 'flex-end',
                           justifyContent: 'space-between',
                        }}
                     >
                        <div style={{ width: '60%' }}>
                           <Input
                              disabled={editable}
                              type="number"
                              placeholder={t(
                                 address.concat('enter order quantity')
                              )}
                              value={orderQuantity}
                              onChange={e => {
                                 const value = parseInt(e.target.value)
                                 if (e.target.value.length === 0)
                                    setOrderQuantity('')
                                 if (value) setOrderQuantity(value)
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
                        </div>

                        <Text as="title">
                           (in{' '}
                           {state.supplierItem?.bulkItemAsShipped?.unit ||
                              state?.unit ||
                              'N/A'}
                           )
                        </Text>
                     </div>
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
            </StyledForm>
         </StyledWrapper>
      </>
   )
}
