import {
   ButtonTile,
   Input,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui/'
import React, { useReducer, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import { ItemCard, Spacer, StatusSwitch } from '../../../components'
import FormHeading from '../../../components/FormHeading'
import {
   PurchaseOrderContext,
   reducers,
   state as initialState,
} from '../../../context/purchaseOrder'
import { Context } from '../../../context/tabs'
import { FormActions, StyledForm, StyledWrapper } from '../styled'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'

import {
   SUPPLIER_ITEMS_SUBSCRIPTION,
   CREATE_PURCHASE_ORDER,
   UPDATE_PURCHASE_ORDER,
   PURCHASE_ORDER_SUBSCRIPTION,
} from '../../../graphql'

const address = 'apps.inventory.views.forms.purchaseorders.'

export default function PurchaseOrderForm() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [purchaseOrderState, purchaseOrderDispatch] = useReducer(
      reducers,
      initialState
   )
   const { state } = useContext(Context)
   const [status, setStatus] = useState(
      state.purchaseOrder.status || purchaseOrderState.status || ''
   )

   const { data: supplierItemsData, loading } = useSubscription(
      SUPPLIER_ITEMS_SUBSCRIPTION
   )
   const { data: purchaseItemsData, loading: orderLoading } = useSubscription(
      PURCHASE_ORDER_SUBSCRIPTION,
      {
         variables: { id: state.purchaseOrder?.id },
      }
   )
   const [createPurchaseOrder] = useMutation(CREATE_PURCHASE_ORDER)
   const [updatePurchaseOrder] = useMutation(UPDATE_PURCHASE_ORDER)

   const [orderQuantity, setOrderQuantity] = useState(
      purchaseItemsData?.purchaseOrderItem?.orderQuantity || ''
   )

   React.useEffect(() => {
      if (state.purchaseOrder?.id) {
         purchaseOrderDispatch({
            type: 'SET_META',
            payload: {
               id: state.purchaseOrder.id,
               status: state.purchaseOrder.status,
            },
         })
      }
   }, [state.purchaseOrder.id])

   const saveStatus = async status => {
      const response = await updatePurchaseOrder({
         variables: { id: purchaseOrderState.id, status },
      })

      if (response?.data) {
         toast.info('Work Order updated successfully!')

         purchaseOrderDispatch({
            type: 'SET_META',
            payload: {
               id: response.data.updatePurchaseOrder?.returning[0]?.id,
               status: response.data.updatePurchaseOrder?.returning[0]?.status,
            },
         })
      }
   }

   const checkForm = () => {
      if (!purchaseOrderState.supplierItem?.id) {
         toast.error('No Supplier Item selecetd!')
         return false
      }
      if (!orderQuantity) {
         toast.error('Please provide orde quantity!')
         return false
      }

      return true
   }

   const handleSubmit = async () => {
      const isValid = checkForm()
      if (isValid) {
         const {
            id: supplierItemId,
            bulkItemAsShippedId: bulkItemId,
            bulkItemAsShipped: { unit },
            supplier: { id: supplierId },
         } = purchaseOrderState.supplierItem

         const resp = await createPurchaseOrder({
            variables: {
               object: {
                  bulkItemId,
                  orderQuantity,
                  status: 'PENDING',
                  supplierId,
                  supplierItemId,
                  unit,
               },
            },
         })

         if (resp?.data?.createPurchaseOrderItem) {
            toast.success('Purchase Order created successfully!')

            const fetchedStatus =
               resp?.data?.createPurchaseOrderItem.returning[0].status

            const fetchedId =
               resp?.data?.createPurchaseOrderItem.returning[0].id

            setStatus(fetchedStatus)

            purchaseOrderDispatch({
               type: 'SET_META',
               payload: { id: fetchedId, status: fetchedStatus },
            })
         }
      }
   }

   if (loading || orderLoading) return <Loader />

   return (
      <>
         <PurchaseOrderContext.Provider
            value={{ purchaseOrderState, purchaseOrderDispatch }}
         >
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <SelectSupplierItemTunnel
                     supplierItems={supplierItemsData?.supplierItems}
                     close={closeTunnel}
                  />
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

                  <FormActions>
                     {status ? (
                        <StatusSwitch
                           currentStatus={status}
                           onSave={saveStatus}
                        />
                     ) : (
                        <TextButton onClick={handleSubmit} type="solid">
                           {t(address.concat('submit'))}
                        </TextButton>
                     )}
                  </FormActions>
               </FormHeading>

               <StyledForm style={{ padding: '0px 60px' }}>
                  <Text as="title">{t(address.concat('supplier item'))}</Text>
                  {purchaseOrderState.supplierItem?.name ||
                  purchaseItemsData?.purchaseOrderItem?.supplierItem?.id ? (
                     <>
                        {status ? (
                           <ItemCard
                              title={
                                 purchaseOrderState.supplierItem.name ||
                                 purchaseItemsData?.purchaseOrderItem
                                    ?.supplierItem?.name
                              }
                              onHand={
                                 purchaseOrderState.supplierItem
                                    ?.bulkItemAsShipped?.onHand
                              }
                           />
                        ) : (
                           <ItemCard
                              title={
                                 purchaseOrderState.supplierItem.name ||
                                 purchaseItemsData?.purchaseOrderItem
                                    ?.supplierItem?.name
                              }
                              onHand={
                                 purchaseOrderState.supplierItem
                                    ?.bulkItemAsShipped?.onHand
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
                                 disabled={!!status}
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
                              />
                           </div>

                           <Text as="title">
                              (in{' '}
                              {purchaseItemsData?.purchaseOrderItem?.unit ||
                                 purchaseOrderState.supplierItem
                                    ?.bulkItemAsShipped?.unit}
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
         </PurchaseOrderContext.Provider>
      </>
   )
}
