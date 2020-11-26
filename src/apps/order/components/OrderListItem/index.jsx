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
   StyledOrderType,
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
   HomeIcon,
} from '../../assets/icons'

import { QUERIES, UPDATE_ORDER_STATUS } from '../../graphql'
import { formatDate } from '../../utils'
import { useTabs, useOrder } from '../../context'
import { currencyFmt } from '../../../../shared/utils'
import pickUpIcon from '../../assets/svgs/pickup.png'
import deliveryIcon from '../../assets/svgs/delivery.png'

const address = 'apps.order.components.orderlistitem.'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

const normalize = address =>
   `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''} ${
      address.city
   }, ${address.state}, ${address.zipcode}`

const OrderListItem = ({ containerId, order = {} }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { dispatch } = useOrder()
   const [currentPanel, setCurrentPanel] = React.useState('customer')
   const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS)
   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(QUERIES.ORDER.STATUSES)
   const {
      id = '',
      orderStatus = '',
      orderMealKitProducts: mealkits = [],
      orderInventoryProducts: inventories = [],
      orderReadyToEatProducts: readytoeats = [],
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
      <StyledOrderItem status={orderStatus} id={containerId}>
         <section>
            <ListBodyItem isOpen={currentPanel === 'customer'}>
               <header>
                  <span>
                     <CustomerName data={deliveryInfo?.dropoff?.dropoffInfo} />
                  </span>
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
                           <CustomerPhone
                              data={deliveryInfo?.dropoff?.dropoffInfo}
                           />
                           <CustomerEmail
                              data={deliveryInfo?.dropoff?.dropoffInfo}
                           />
                           {deliveryInfo?.dropoff?.dropoffInfo
                              ?.customerAddress && (
                              <CustomerAddress
                                 data={deliveryInfo?.dropoff?.dropoffInfo}
                              />
                           )}
                        </StyledConsumer>
                     )}
               </main>
            </ListBodyItem>
            <ListBodyItem isOpen={currentPanel === 'billing'}>
               <header>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>
                     Amount Paid: {currencyFmt(Number(rest.amountPaid) || 0)}
                  </span>
                  <ToggleButton
                     type="billing"
                     current={currentPanel}
                     toggle={setCurrentPanel}
                  />
               </header>
               <main>
                  <StyledStat>
                     <span>{t(address.concat('tax'))}</span>
                     <span>{currencyFmt(Number(rest.tax) || 0)}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('discount'))}</span>
                     <span>{rest.discount}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('delivery price'))}</span>
                     <span>{currencyFmt(Number(rest.deliveryPrice) || 0)}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('total'))}</span>
                     <span>{currencyFmt(Number(rest.amountPaid) || 0)}</span>
                  </StyledStat>
               </main>
            </ListBodyItem>
         </section>
         <StyledProducts>
            <StyledHeader>
               <StyledOrderType>
                  {isPickup(order.fulfillmentType) ? (
                     <img alt="Pick Up" title="Pick Up" src={pickUpIcon} />
                  ) : (
                     <img alt="Delivery" title="Delivery" src={deliveryIcon} />
                  )}
               </StyledOrderType>
               <StyledButton type="button" onClick={() => createTab(id)}>
                  ORD{order.id}
                  <NewTabIcon size={14} />
               </StyledButton>
               <StyledPrint onClick={() => print()}>
                  <PrintIcon size={16} />
               </StyledPrint>
               {['ONDEMAND_DELIVERY', 'PREORDER_DELIVERY'].includes(
                  order.fulfillmentType
               ) && (
                  <StyledButton
                     type="button"
                     onClick={() =>
                        dispatch({
                           type: 'DELIVERY_PANEL',
                           payload: { orderId: order.id },
                        })
                     }
                  >
                     {order?.deliveryInfo?.deliveryCompany?.name
                        ? 'View'
                        : 'Select'}{' '}
                     Delivery
                  </StyledButton>
               )}

               <section>
                  <StyledStatus>
                     <span>{t(address.concat('ordered on'))}:&nbsp;</span>
                     <span>{formatDate(order?.created_at)}</span>
                  </StyledStatus>
                  &nbsp;|&nbsp;
                  <ReadyBy data={deliveryInfo?.pickup} />
                  &nbsp;|&nbsp;
                  {isPickup(order.fulfillmentType) ? (
                     <TimeSlot
                        type={order.fulfillmentType}
                        data={deliveryInfo?.pickup}
                     />
                  ) : (
                     <TimeSlot
                        type={order.fulfillmentType}
                        data={deliveryInfo?.dropoff}
                     />
                  )}
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
                        {t(address.concat('meal kits'))}{' '}
                        <StyledCount>{mealkits.length || 0}</StyledCount>
                     </StyledTab>
                     <StyledTab>
                        {t(address.concat('ready to eat'))}{' '}
                        <StyledCount>{readytoeats.length}</StyledCount>
                     </StyledTab>
                     <StyledTab>
                        {t(address.concat('inventory'))}{' '}
                        <StyledCount>{inventories.length || 0}</StyledCount>
                     </StyledTab>
                  </StyledTabList>
                  <StyledTabPanels>
                     <StyledTabPanel>
                        {inventories.map(inventory => (
                           <StyledProductItem key={inventory.id}>
                              <div>
                                 <ProductTitle
                                    data={inventory}
                                    type="INVENTORY"
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
                                    &nbsp; - &nbsp;
                                    {inventory?.inventoryProductOption?.label}
                                 </span>
                              </StyledServings>
                              <span>{inventory.isAssembled ? 1 : 0} / 1</span>
                           </StyledProductItem>
                        ))}
                        {mealkits.map(mealkit => (
                           <StyledProductItem key={mealkit.id}>
                              <div>
                                 <ProductTitle data={mealkit} type="MEAL_KIT" />
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
                                    type="READY_TO_EAT"
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
                              <span>{readytoeat?.isAssembled ? 1 : 0} / 1</span>
                           </StyledProductItem>
                        ))}
                     </StyledTabPanel>
                     <StyledTabPanel>
                        {mealkits.length > 0
                           ? mealkits.map(mealkit => (
                                <StyledProductItem key={mealkit.id}>
                                   <div>
                                      <ProductTitle
                                         data={mealkit}
                                         type="MEAL_KIT"
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
                                         type="READY_TO_EAT"
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
                                      {readytoeat?.isAssembled ? 1 : 0} / 1
                                   </span>
                                </StyledProductItem>
                             ))
                           : t(address.concat('no ready to eat'))}
                     </StyledTabPanel>
                     <StyledTabPanel>
                        {inventories.length > 0
                           ? inventories.map(inventory => (
                                <StyledProductItem key={inventory.id}>
                                   <div>
                                      <ProductTitle
                                         data={inventory}
                                         type="INVENTORY"
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
                                         &nbsp; - &nbsp;
                                         {
                                            inventory?.inventoryProductOption
                                               ?.label
                                         }
                                      </span>
                                   </StyledServings>
                                   <span>
                                      {inventory.isAssembled ? 1 : 0} / 1
                                   </span>
                                </StyledProductItem>
                             ))
                           : t(address.concat('no inventories'))}
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
         <span style={{ marginRight: 8 }}>
            <HomeIcon size={14} color="#718096" />
         </span>
         <span>{normalize(data?.customerAddress)}</span>
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

const ReadyBy = ({ data = {} }) => {
   const { t } = useTranslation()
   return (
      <StyledStatus>
         <span>{t(address.concat('ready by'))}:&nbsp;</span>
         <span>
            {data?.window?.approved?.startsAt
               ? formatDate(data?.window?.approved?.startsAt)
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}

const TimeSlot = ({ type, data = {} }) => {
   const { t } = useTranslation()
   return (
      <StyledStatus>
         <span>
            {isPickup(type)
               ? t(address.concat('pickup'))
               : t(address.concat('Delivery'))}
            :&nbsp;
         </span>
         <span>
            {data?.window?.approved?.startsAt
               ? formatDate(data?.window?.approved?.startsAt, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                 })
               : 'N/A'}
            ,&nbsp;
            {data?.window?.approved?.startsAt
               ? formatDate(data?.window?.approved?.startsAt, {
                    minute: 'numeric',
                    hour: 'numeric',
                 })
               : 'N/A'}
            -
            {data?.window?.approved?.endsAt
               ? formatDate(data?.window?.approved?.endsAt, {
                    minute: 'numeric',
                    hour: 'numeric',
                 })
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}

const ProductTitle = ({ data, type }) => {
   return (
      <StyledProductTitle>
         {['READY_TO_EAT', 'MEAL_KIT'].includes(type) &&
            data?.simpleRecipeProduct?.name}
         {type === 'INVENTORY' && data?.inventoryProduct?.name}
         {data?.comboProduct?.name && <span>&nbsp;-&nbsp;</span>}
         {data?.comboProduct?.name}
         {data?.comboProductComponent?.label &&
            `(${data?.comboProductComponent?.label})`}
      </StyledProductTitle>
   )
}
