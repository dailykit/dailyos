import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   StyledOrderItem,
   StyledOrderId,
   StyledConsumer,
   StyledConsumerName,
   StyledConsumerAddress,
   StyledConsumerContact,
   StyledCount,
   StyledProductItem,
   StyledProductTitle,
   StyledProductTypeTitle,
   StyledServings,
   StyledStatus,
   StyledStatusBadge,
} from './styled'

import { PhoneIcon, EmailIcon, UserIcon, RightIcon } from '../../assets/icons'

import { formatDate } from '../../utils'

import { ORDER_STATUSES, UPDATE_ORDER_STATUS } from '../../graphql'
import { useTabs } from '../../context'

const normalize = address =>
   `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''} ${
      address.city
   }, ${address.state}, ${address.zipcode}`

const OrderListItem = ({ order, setDetails }) => {
   const { addTab } = useTabs()
   const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS)
   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(ORDER_STATUSES)
   const {
      id,
      orderStatus,
      orderMealKitProducts: mealkits,
      orderInventoryProducts: inventories,
      orderReadyToEatProducts: readytoeats,
      deliveryInfo = {},
   } = order

   const updateStatus = () => {
      const status_list = statuses.map(status => status.value)
      const next = status_list.indexOf(orderStatus)
      if (next + 1 < status_list.length - 1) {
         updateOrderStatus({
            variables: {
               id,
               orderStatus: status_list[next + 1],
            },
         })
      }
   }

   const createTab = orderId => {
      addTab(`ORD${orderId}`, `/order/orders/${orderId}`)
   }

   return (
      <StyledOrderItem status={orderStatus}>
         <section>
            <StyledOrderId>
               <h2>ORD{order.id}</h2>
               <button type="button" onClick={() => createTab(id)}>
                  View Order
               </button>
            </StyledOrderId>
            {deliveryInfo?.dropoff &&
               Object.keys(deliveryInfo?.dropoff).length > 0 && (
                  <StyledConsumer>
                     <StyledConsumerName>
                        {deliveryInfo?.dropoff?.dropoffInfo?.customerFirstName}
                        {deliveryInfo?.dropoff?.dropoffInfo?.customerLastName}
                     </StyledConsumerName>
                     <StyledConsumerAddress>
                        {normalize(
                           deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                        )}
                     </StyledConsumerAddress>
                     <StyledConsumerContact>
                        <span>
                           <PhoneIcon size={14} color="#718096" />
                        </span>
                        <span>
                           {deliveryInfo?.dropoff?.dropoffInfo?.customerPhone}
                        </span>
                     </StyledConsumerContact>
                     <StyledConsumerContact>
                        <span>
                           <EmailIcon size={14} color="#718096" />
                        </span>
                        <span>
                           <a
                              href={`mailto:${deliveryInfo?.dropoff?.dropoffInfo?.customerEmail}`}
                           >
                              {
                                 deliveryInfo?.dropoff?.dropoffInfo
                                    ?.customerEmail
                              }
                           </a>
                        </span>
                     </StyledConsumerContact>
                  </StyledConsumer>
               )}
         </section>
         <section>
            <header>
               <StyledCount>
                  0 /{' '}
                  {inventories.length + mealkits.length + readytoeats.length}{' '}
                  items
               </StyledCount>
            </header>
            <main>
               {inventories.length > 0 && (
                  <StyledProductTypeTitle>
                     Inventory ({inventories.length})
                  </StyledProductTypeTitle>
               )}
               {inventories.map(inventory => (
                  <StyledProductItem key={inventory.id}>
                     <div>
                        <StyledProductTitle>
                           {inventory?.inventoryProduct?.name}&nbsp;-&nbsp;
                           {inventory?.comboProduct?.name}(
                           {inventory?.comboProductComponent?.label})
                        </StyledProductTitle>
                     </div>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {inventory?.inventoryProductOption?.quantity}
                           &nbsp;-&nbsp;
                           {inventory?.inventoryProductOption?.label}
                        </span>
                     </StyledServings>
                     <span>
                        {inventory.assemblyStatus === 'ASSEMBLED' ? 1 : 0} / 1
                     </span>
                  </StyledProductItem>
               ))}
               {mealkits.length > 0 && (
                  <StyledProductTypeTitle>
                     Meal Kits ({mealkits.length})
                  </StyledProductTypeTitle>
               )}
               {mealkits.map(mealkit => (
                  <StyledProductItem key={mealkit.id}>
                     <div>
                        <StyledProductTitle>
                           {mealkit?.simpleRecipeProduct?.name}&nbsp;-&nbsp;
                           {mealkit?.comboProduct?.name}(
                           {mealkit?.comboProductComponent?.label})
                        </StyledProductTitle>
                     </div>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              mealkit?.simpleRecipeProductOption
                                 ?.simpleRecipeYield?.yield?.serving
                           }
                           &nbsp; Servings
                        </span>
                     </StyledServings>
                     <span>
                        {
                           mealkit?.orderSachets.filter(
                              sachet => sachet.isAssembled
                           ).length
                        }
                        &nbsp;/&nbsp;
                        {
                           mealkit?.orderSachets.filter(
                              sachet => sachet.status === 'COMPLETED'
                           ).length
                        }
                        &nbsp; / {mealkit?.orderSachets?.length}
                     </span>
                  </StyledProductItem>
               ))}
               {readytoeats.length > 0 && (
                  <StyledProductTypeTitle>
                     Ready to Eats ({readytoeats.length})
                  </StyledProductTypeTitle>
               )}
               {readytoeats.map(readytoeat => (
                  <StyledProductItem key={readytoeat.id}>
                     <div>
                        <StyledProductTitle>
                           {readytoeat?.comboProduct?.name}&nbsp;-&nbsp;
                           {readytoeat?.comboProduct?.name}(
                           {readytoeat?.comboProductComponent?.label})
                        </StyledProductTitle>
                     </div>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              readytoeat?.simpleRecipeProductOption
                                 ?.simpleRecipeYield?.yield?.serving
                           }
                           &nbsp; Servings
                        </span>
                     </StyledServings>
                     <span>
                        {readytoeat?.assemblyStatus === 'ASSEMBLED' ? 1 : 0} / 1
                     </span>
                  </StyledProductItem>
               ))}
            </main>
         </section>
         <section>
            <StyledStatus>
               <span>Ordered On</span>
               <span>{formatDate(order?.created_at)}</span>
            </StyledStatus>
            {deliveryInfo?.pickup &&
               Object.keys(deliveryInfo?.pickup).length > 0 && (
                  <StyledStatus>
                     <span>Expected Dispatch</span>
                     <span>
                        {formatDate(
                           deliveryInfo?.pickup?.window?.approved?.startsAt
                        )}
                     </span>
                  </StyledStatus>
               )}
            {deliveryInfo?.dropoff &&
               Object.keys(deliveryInfo?.dropoff).length > 0 && (
                  <StyledStatus>
                     <span>Delivery On</span>
                     <span>
                        {formatDate(
                           deliveryInfo?.dropoff?.window?.approved?.startsAt
                        )}
                     </span>
                  </StyledStatus>
               )}
            {/* <Button
               mr={12}
               bg="blue"
               type="solid"
               onClick={() => setDetails(order)}
            >
               View Order
            </Button>
            */}
         </section>
         <StyledStatusBadge status={orderStatus} onClick={() => updateStatus()}>
            {orderStatus.split('_').join(' ')}
            <span>
               <RightIcon size={20} color="#fff" />
            </span>
         </StyledStatusBadge>
      </StyledOrderItem>
   )
}

export default OrderListItem
