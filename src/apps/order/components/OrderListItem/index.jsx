import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import {
   StyledOrderItem,
   StyledButton,
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
   StyledPrint,
} from './styled'

import {
   PhoneIcon,
   EmailIcon,
   UserIcon,
   RightIcon,
   ArrowDownIcon,
   ArrowUpIcon,
   NewTabIcon,
   PrintIcon,
} from '../../assets/icons'

import { formatDate } from '../../utils'

import { ORDER_STATUSES, UPDATE_ORDER_STATUS } from '../../graphql'
import { useTabs, useOrder } from '../../context'

const address = 'apps.order.components.orderlistitem.'

const normalize = address =>
   `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''} ${
      address.city
   }, ${address.state}, ${address.zipcode}`

const OrderListItem = ({ order }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { dispatch } = useOrder()
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

   const createTab = () => {
      addTab(`ORD${order.id}`, `/apps/order/orders/${order.id}`)
   }

   const print = () => {
      const template = encodeURIComponent(
         JSON.stringify({ name: 'bill1', type: 'bill', format: 'pdf' })
      )
      const data = encodeURIComponent(JSON.stringify({ id: order.id }))
      window.open(
         `${process.env.REACT_APP_TEMPLATE_URL}?template=${template}&data=${data}`,
         '_blank'
      )
   }

   return (
      <StyledOrderItem status={orderStatus}>
         <section>
            <ListBodyItem isOpen={currentPanel === 'customer'}>
               <header>
                  <span>{t(address.concat('customer info'))}</span>
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
                  <span>{t(address.concat('billing info'))}</span>
                  <ToggleButton
                     type="billing"
                     current={currentPanel}
                     toggle={setCurrentPanel}
                  />
               </header>
               <main>
                  <StyledStat>
                     <span>{t(address.concat('tax'))}</span>
                     <span>{rest.tax}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('discount'))}</span>
                     <span>{rest.discount}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('delivery price'))}</span>
                     <span>{rest.deliveryPrice}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('total'))}</span>
                     <span>{rest.amountPaid}</span>
                  </StyledStat>
               </main>
            </ListBodyItem>
         </section>
         <StyledProducts>
            <StyledHeader>
               <StyledButton type="button" onClick={() => createTab(id)}>
                  ORD{order.id}
                  <NewTabIcon size={14} />
               </StyledButton>
               <StyledPrint onClick={() => print()}>
                  <PrintIcon size={16} />
               </StyledPrint>
               <StyledButton
                  type="button"
                  onClick={() =>
                     dispatch({
                        type: 'DELIVERY_PANEL',
                        payload: { orderId: order.id },
                     })
                  }
               >
                  View Delivery
               </StyledButton>
               <section>
                  <StyledStatus>
                     <span>{t(address.concat('ordered on'))}:&nbsp;</span>
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
                        {t(address.concat('all'))}{' '}
                        <StyledCount>
                           0 /&nbsp;
                           {inventories.length +
                              mealkits.length +
                              readytoeats.length}
                           &nbsp;
                        </StyledCount>
                     </StyledTab>
                     <StyledTab>
                        {t(address.concat('inventory'))}{' '}
                        <StyledCount>{inventories.length || 0}</StyledCount>
                     </StyledTab>
                     <StyledTab>
                        {t(address.concat('meal kits'))}{' '}
                        <StyledCount>{mealkits.length || 0}</StyledCount>
                     </StyledTab>
                     <StyledTab>
                        {t(address.concat('ready to eat'))}{' '}
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
                                 {inventory.assemblyStatus === 'COMPLETED'
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
                                    &nbsp; {t(address.concat('servings'))}
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
                                       sachet => sachet.status === 'PACKED'
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
                                    &nbsp; {t(address.concat('servings'))}
                                 </span>
                              </StyledServings>
                              <span>
                                 {readytoeat?.assemblyStatus === 'COMPLETED'
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
                                      {inventory.assemblyStatus === 'COMPLETED'
                                         ? 1
                                         : 0}{' '}
                                      / 1
                                   </span>
                                </StyledProductItem>
                             ))
                           : t(address.concat('no inventories'))}
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
                                         &nbsp; {t(address.concat('servings'))}
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
                                            sachet => sachet.status === 'PACKED'
                                         ).length
                                      }
                                      &nbsp; / {mealkit?.orderSachets?.length}
                                   </span>
                                </StyledProductItem>
                             ))
                           : t(address.concat('no meal kits'))}
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
                                         &nbsp; {t(address.concat('servings'))}
                                      </span>
                                   </StyledServings>
                                   <span>
                                      {readytoeat?.assemblyStatus ===
                                      'COMPLETED'
                                         ? 1
                                         : 0}{' '}
                                      / 1
                                   </span>
                                </StyledProductItem>
                             ))
                           : t(address.concat('no ready to eat'))}
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
   const { t } = useTranslation()
   return (
      <StyledStatus>
         <span>{t(address.concat('expected dispatch'))}:&nbsp;</span>
         <span>
            {data?.window?.approved?.startsAt
               ? formatDate(data?.window?.approved?.startsAt)
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}

const DeliveryOn = ({ data = {} }) => {
   const { t } = useTranslation()
   return (
      <StyledStatus>
         <span>{t(address.concat('delivery on'))}:&nbsp;</span>
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
