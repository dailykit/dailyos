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
import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import { ItemCard, Spacer, StatusSwitch } from '../../../components'
import FormHeading from '../../../components/FormHeading'

import { Context } from '../../../context/tabs'
import { FormActions, StyledForm, StyledWrapper } from '../styled'

import {
   CREATE_PURCHASE_ORDER,
   UPDATE_PURCHASE_ORDER,
   PACKAGING_PURCHASE_ORDER_SUBSCRIPTION,
} from '../../../graphql'

const address = 'apps.inventory.views.forms.purchaseorders.'

function onError(error) {
   toast.error(error.message)
   console.log(error)
}

export default function PackagingPurchaseOrderForm() {
   const { t } = useTranslation()
   const [orderQuantity, setOrderQuantity] = useState(0)

   const {
      state: {
         current: { id },
      },
   } = useContext(Context)

   const {
      data: { purchaseOrderItem: item = {} } = {},
      loading: orderLoading,
   } = useSubscription(PACKAGING_PURCHASE_ORDER_SUBSCRIPTION, {
      variables: { id },
      onSubscriptionData: data => {
         const { orderQuantity } = data.subscriptionData.data.purchaseOrderItem
         setOrderQuantity(orderQuantity)
      },
      onError,
   })

   const [updatePurchaseOrderItem] = useMutation(UPDATE_PURCHASE_ORDER, {
      onError,
      onCompleted: () => toast.success('Status updated.'),
   })

   const saveStatus = async status => {
      updatePurchaseOrderItem({
         variables: {
            id: item.id,
            status,
         },
      })
   }

   const handleSubmit = async () => {}

   if (orderLoading) return <Loader />

   return (
      <>
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
                  {item.status ? (
                     <StatusSwitch
                        currentStatus={item.status}
                        onSave={saveStatus}
                     />
                  ) : (
                     <TextButton onClick={handleSubmit} type="solid">
                        {t(address.concat('submit'))}
                     </TextButton>
                  )}
               </FormActions>
            </FormHeading>

            <StyledForm style={{ width: '90%', margin: '0 auto' }}>
               <Content
                  item={item}
                  orderQuantity={orderQuantity}
                  setOrderQuantity={setOrderQuantity}
               />
            </StyledForm>
         </StyledWrapper>
      </>
   )
}

function Content({ item, orderQuantity, setOrderQuantity }) {
   const { t } = useTranslation()
   return (
      <>
         <Text as="title">Select Packaging</Text>

         {item && item.packaging ? (
            <>
               <ItemCard
                  title={item.packaging.packagingName}
                  onHand={item.packaging.onHand}
               />

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
                        disabled={item.status}
                        type="number"
                        placeholder={t(address.concat('enter order quantity'))}
                        value={orderQuantity}
                        onChange={e => setOrderQuantity(e.target.value)}
                     />
                  </div>

                  <Text as="title">in {item.unit || 'pieces'}</Text>
               </div>
            </>
         ) : (
            <ButtonTile
               noIcon
               type="secondary"
               text="Select Packaging"
               onClick={() => {}}
               style={{ margin: '20px 0' }}
            />
         )}
      </>
   )
}
