import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   StyledOrderItem,
   StyledViewOrder,
   StyledConsumer,
   StyledConsumerName,
   StyledConsumerAddress,
   StyledConsumerContact,
   StyledCount,
   StyledProductItem,
   StyledProductTitle,
   StyledProducts,
   StyledServings,
   StyledStatus,
   StyledStatusBadge,
   ListBodyItem,
   StyledTabs,
   StyledTab,
   StyledTabList,
   StyledTabPanels,
   StyledTabPanel,
   StyledHeader,
   StyledStat,
} from './styled'

import {
   PhoneIcon,
   EmailIcon,
   UserIcon,
   RightIcon,
   ArrowDownIcon,
   ArrowUpIcon,
   NewTabIcon,
} from '../../assets/icons'

import { formatDate } from '../../utils'

import { ORDER_STATUSES, UPDATE_ORDER_STATUS } from '../../graphql'
import { useTabs } from '../../context'

const normalize = address =>
   `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''} ${
      address.city
   }, ${address.state}, ${address.zipcode}`

const OrderListItem = ({ order }) => {
   const { addTab } = useTabs()
   const [currentPanel, setCurrentPanel] = React.useState('customer')
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
      ...rest
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
            <ListBodyItem isOpen={currentPanel === 'customer'}>
               <header>
                  <span>Customer Info</span>
                  <ToggleButton
                     type="customer"
                     current={currentPanel}
                     toggle={setCurrentPanel}
                  />
               </header>
               <main>
                  {deliveryInfo?.dropoff &&
                     Object.keys(deliveryInfo?.dropoff).length > 0 && (
                        <StyledConsumer>
                           <CustomerName
                              data={deliveryInfo?.dropoff?.dropoffInfo}
                           />
                           <CustomerAddress
                              data={deliveryInfo?.dropoff?.dropoffInfo}
                           />
                           <CustomerPhone
                              data={deliveryInfo?.dropoff?.dropoffInfo}
                           />
                           <CustomerEmail
                              data={deliveryInfo?.dropoff?.dropoffInfo}
                           />
                        </StyledConsumer>
                     )}
               </main>
            </ListBodyItem>
            <ListBodyItem isOpen={currentPanel === 'billing'}>
               <header>
                  <span>Billing Info</span>
                  <ToggleButton
                     type="billing"
                     current={currentPanel}
                     toggle={setCurrentPanel}
                  />
               </header>
               <main>
                  <StyledStat>
                     <span>Tax</span>
                     <span>{rest.tax}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>Discount</span>
                     <span>{rest.discount}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>Delivery Price</span>
                     <span>{rest.deliveryPrice}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>Item Total</span>
                     <span>{rest.itemTotal}</span>
                  </StyledStat>
               </main>
            </ListBodyItem>
         </section>
         <StyledProducts>
            <StyledHeader>
               <StyledViewOrder type="button" onClick={() => createTab(id)}>
                  ORD{order.id}
                  <NewTabIcon size={14} />
               </StyledViewOrder>
               <span>Total: ${order.itemTotal}</span>
               <section>
                  <StyledStatus>
                     <span>Ordered On:&nbsp;</span>
                     <span>{formatDate(order?.created_at)}</span>
                  </StyledStatus>
                  &nbsp;|&nbsp;
                  <ExpectedDelivery data={deliveryInfo?.pickup} />
                  &nbsp;|&nbsp;
                  <DeliveryOn data={deliveryInfo?.dropoff} />
               </section>
            </StyledHeader>
            <main>
               <StyledTabs>
                  <StyledTabList>
                     <StyledTab>
                        All{' '}
                        <StyledCount>
                           0 /&nbsp;
                           {inventories.length +
                              mealkits.length +
                              readytoeats.length}
                           &nbsp;
                        </StyledCount>
                     </StyledTab>
                     <StyledTab>
                        Inventory{' '}
                        <StyledCount>{inventories.length || 0}</StyledCount>
                     </StyledTab>
                     <StyledTab>
                        Meal Kits{' '}
                        <StyledCount>{mealkits.length || 0}</StyledCount>
                     </StyledTab>
                     <StyledTab>
                        Ready to Eats{' '}
                        <StyledCount>{readytoeats.length}</StyledCount>
                     </StyledTab>
                  </StyledTabList>
                  <StyledTabPanels>
                     <StyledTabPanel>
                        {inventories.map(inventory => (
                           <StyledProductItem key={inventory.id}>
                              <div>
                                 <ProductTitle
                                    data={inventory}
                                    product={inventory?.inventoryProduct}
                                 />
                              </div>
                              <StyledServings>
                                 <span>
                                    <UserIcon size={16} color="#555B6E" />
                                 </span>
                                 <span>
                                    {
                                       inventory?.inventoryProductOption
                                          ?.quantity
                                    }
                                    &nbsp;-&nbsp;
                                    {inventory?.inventoryProductOption?.label}
                                 </span>
                              </StyledServings>
                              <span>
                                 {inventory.assemblyStatus === 'ASSEMBLED'
                                    ? 1
                                    : 0}{' '}
                                 / 1
                              </span>
                           </StyledProductItem>
                        ))}
                        {mealkits.map(mealkit => (
                           <StyledProductItem key={mealkit.id}>
                              <div>
                                 <ProductTitle
                                    data={mealkit}
                                    product={mealkit?.simpleRecipeProduct}
                                 />
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
                        {readytoeats.map(readytoeat => (
                           <StyledProductItem key={readytoeat.id}>
                              <div>
                                 <ProductTitle
                                    data={readytoeat}
                                    product={readytoeat?.comboProduct}
                                 />
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
                                 {readytoeat?.assemblyStatus === 'ASSEMBLED'
                                    ? 1
                                    : 0}{' '}
                                 / 1
                              </span>
                           </StyledProductItem>
                        ))}
                     </StyledTabPanel>
                     <StyledTabPanel>
                        {inventories.length > 0
                           ? inventories.map(inventory => (
                                <StyledProductItem key={inventory.id}>
                                   <div>
                                      <ProductTitle
                                         data={inventory}
                                         product={inventory?.inventoryProduct}
                                      />
                                   </div>
                                   <StyledServings>
                                      <span>
                                         <UserIcon size={16} color="#555B6E" />
                                      </span>
                                      <span>
                                         {
                                            inventory?.inventoryProductOption
                                               ?.quantity
                                         }
                                         &nbsp;-&nbsp;
                                         {
                                            inventory?.inventoryProductOption
                                               ?.label
                                         }
                                      </span>
                                   </StyledServings>
                                   <span>
                                      {inventory.assemblyStatus === 'ASSEMBLED'
                                         ? 1
                                         : 0}{' '}
                                      / 1
                                   </span>
                                </StyledProductItem>
                             ))
                           : 'No inventories'}
                     </StyledTabPanel>
                     <StyledTabPanel>
                        {mealkits.length > 0
                           ? mealkits.map(mealkit => (
                                <StyledProductItem key={mealkit.id}>
                                   <div>
                                      <ProductTitle
                                         data={mealkit}
                                         product={mealkit?.simpleRecipeProduct}
                                      />
                                   </div>
                                   <StyledServings>
                                      <span>
                                         <UserIcon size={16} color="#555B6E" />
                                      </span>
                                      <span>
                                         {
                                            mealkit?.simpleRecipeProductOption
                                               ?.simpleRecipeYield?.yield
                                               ?.serving
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
                                            sachet =>
                                               sachet.status === 'COMPLETED'
                                         ).length
                                      }
                                      &nbsp; / {mealkit?.orderSachets?.length}
                                   </span>
                                </StyledProductItem>
                             ))
                           : 'No Meal Kits'}
                     </StyledTabPanel>
                     <StyledTabPanel>
                        {readytoeats.length > 0
                           ? readytoeats.map(readytoeat => (
                                <StyledProductItem key={readytoeat.id}>
                                   <div>
                                      <ProductTitle
                                         data={readytoeat}
                                         product={readytoeat?.comboProduct}
                                      />
                                   </div>
                                   <StyledServings>
                                      <span>
                                         <UserIcon size={16} color="#555B6E" />
                                      </span>
                                      <span>
                                         {
                                            readytoeat
                                               ?.simpleRecipeProductOption
                                               ?.simpleRecipeYield?.yield
                                               ?.serving
                                         }
                                         &nbsp; Servings
                                      </span>
                                   </StyledServings>
                                   <span>
                                      {readytoeat?.assemblyStatus ===
                                      'ASSEMBLED'
                                         ? 1
                                         : 0}{' '}
                                      / 1
                                   </span>
                                </StyledProductItem>
                             ))
                           : 'No Ready to Eats'}
                     </StyledTabPanel>
                  </StyledTabPanels>
               </StyledTabs>
            </main>
         </StyledProducts>

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

const CustomerName = ({ data }) => {
   return (
      <StyledConsumerName>
         {data?.customerFirstName}
         &nbsp;
         {data?.customerLastName}
      </StyledConsumerName>
   )
}

const CustomerAddress = ({ data }) => {
   return (
      <StyledConsumerAddress>
         {normalize(data?.customerAddress)}
      </StyledConsumerAddress>
   )
}

const CustomerPhone = ({ data }) => {
   return (
      <StyledConsumerContact>
         <span>
            <PhoneIcon size={14} color="#718096" />
         </span>
         <span>{data?.customerPhone}</span>
      </StyledConsumerContact>
   )
}

const CustomerEmail = ({ data }) => {
   return (
      <StyledConsumerContact>
         <span>
            <EmailIcon size={14} color="#718096" />
         </span>
         <span>
            <a
               target="__blank"
               rel="noopener roreferrer"
               href={`mailto:${data?.customerEmail}`}
            >
               {data?.customerEmail}
            </a>
         </span>
      </StyledConsumerContact>
   )
}

const ToggleButton = ({ type, current, toggle }) => {
   return (
      <button
         type="button"
         onClick={() => toggle(current === type ? '' : type)}
      >
         {current === type ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </button>
   )
}

const ExpectedDelivery = ({ data = {} }) => {
   return (
      <StyledStatus>
         <span>Expected Dispatch:&nbsp;</span>
         <span>
            {data?.window?.approved?.startsAt
               ? formatDate(data?.window?.approved?.startsAt)
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}

const DeliveryOn = ({ data = {} }) => {
   return (
      <StyledStatus>
         <span>Delivery On:&nbsp;</span>
         <span>
            {data.window?.approved?.startsAt
               ? formatDate(data.window?.approved?.startsAt)
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}

const ProductTitle = ({ data, product }) => {
   return (
      <StyledProductTitle>
         {product?.name}&nbsp;-&nbsp;
         {data?.comboProduct?.name}({data?.comboProductComponent?.label})
      </StyledProductTitle>
   )
}
