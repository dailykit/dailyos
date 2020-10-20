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
import { logger } from '../../../../../shared/utils/errorLog'
import {
   ItemCard,
   Spacer as Separator,
   StatusSwitch,
} from '../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import {
   PACKAGING_PURCHASE_ORDER_SUBSCRIPTION,
   UPDATE_PURCHASE_ORDER,
   UPDATE_PURCHASE_ORDER_ITEM,
} from '../../../graphql'
import { StyledHeader } from '../../Listings/styled'
import { StyledWrapper } from '../styled'
import PackagingTunnel from './PackagingTunnel'

const address = 'apps.inventory.views.forms.purchaseorders.'

function onError(error) {
   toast.error(GENERAL_ERROR_MESSAGE)
   logger(error)
}

export default function PackagingPurchaseOrderForm() {
   const { t } = useTranslation()
   const [orderQuantity, setOrderQuantity] = useState(0)
   const { id } = useParams()

   const {
      data: { purchaseOrderItem: item = {} } = {},
      loading: orderLoading,
      error,
   } = useSubscription(PACKAGING_PURCHASE_ORDER_SUBSCRIPTION, {
      variables: { id },
      onSubscriptionData: data => {
         const { orderQuantity } = data.subscriptionData.data.purchaseOrderItem
         setOrderQuantity(orderQuantity)
      },
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

   if (error) {
      onError(error)
      throw error
   }

   if (orderLoading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <Text as="h1">{t(address.concat('purchase order'))}</Text>

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
            </StyledHeader>

            <Content
               item={item}
               orderQuantity={orderQuantity}
               setOrderQuantity={setOrderQuantity}
            />
         </StyledWrapper>
      </>
   )
}

function Content({ item, orderQuantity, setOrderQuantity }) {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(4)

   const [updatePurchaseOrderItem] = useMutation(UPDATE_PURCHASE_ORDER_ITEM, {
      onError,
      onCompleted: () => {
         toast.success('quantity updated.')
      },
   })

   const updateOrderQuantity = value => {
      updatePurchaseOrderItem({
         variables: { id: item.id, set: { orderQuantity: +value } },
      })
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <PackagingTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Text as="title">Select Packaging</Text>

         {item && item.packaging ? (
            <>
               <ItemCard
                  title={item.packaging.packagingName}
                  onHand={item.packaging.onHand}
               />

               <Separator />
               <Flex container alignItems="flex-end">
                  <Form.Group>
                     <Form.Label htmlFor="quantity" title="quantity">
                        {t(address.concat('enter order quantity'))}
                     </Form.Label>
                     <Form.Number
                        id="quantity"
                        name="quantity"
                        hasWriteAccess={item.status === 'PENDING'}
                        placeholder={t(address.concat('enter order quantity'))}
                        value={orderQuantity}
                        onChange={e => setOrderQuantity(e.target.value)}
                        onBlur={e => updateOrderQuantity(e.target.value)}
                     />
                  </Form.Group>
                  <Spacer xAxis size="8px" />
                  <Text as="title">in {item.unit || 'pieces'}</Text>
               </Flex>
            </>
         ) : (
            <ButtonTile
               noIcon
               type="secondary"
               text="Select Packaging"
               onClick={() => openTunnel(1)}
               style={{ margin: '20px 0' }}
            />
         )}
      </>
   )
}
