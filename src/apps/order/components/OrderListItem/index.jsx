import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Flex,
   Text,
   Spacer,
   IconButton,
   TextButton,
   ComboButton,
} from '@dailykit/ui'

import {
   Styles,
   StyledOrderItem,
   StyledCount,
   StyledProductItem,
   StyledProductTitle,
   StyledProducts,
   StyledServings,
   StyledStatus,
   StyledStatusBadge,
   StyledTabs,
   StyledTab,
   StyledTabList,
   StyledTabPanels,
   StyledTabPanel,
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
   PrintIcon,
   HomeIcon,
} from '../../assets/icons'

import { formatDate } from '../../utils'
import { useTabs, useOrder } from '../../context'
import { QUERIES, MUTATIONS } from '../../graphql'
import pickUpIcon from '../../assets/svgs/pickup.png'
import deliveryIcon from '../../assets/svgs/delivery.png'
import { currencyFmt, logger } from '../../../../shared/utils'

const address = 'apps.order.components.orderlistitem.'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

const normalize = address => {
   return `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''} ${
      address.city
   }, ${address.state}, ${address.zipcode}`
}

const OrderListItem = ({ containerId, order = {} }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { dispatch } = useOrder()
   const [currentPanel, setCurrentPanel] = React.useState('customer')
   const [updateOrder] = useMutation(MUTATIONS.ORDER.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the order!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the order')
      },
   })
   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(QUERIES.ORDER.STATUSES)
   const {
      id = '',
      orderStatus = '',
      orderMealKitProducts: mealkits = [],
      orderInventoryProducts: inventories = [],
      orderReadyToEatProducts: readytoeats = [],
   } = order

   const updateStatus = () => {
      if (Boolean(order.isAccepted !== true && order.isRejected !== true)) {
         toast.error('Pending order confirmation!')
         return
      }
      if (orderStatus === 'DELIVERED') return
      const status_list = statuses.map(status => status.value)
      const next = status_list.indexOf(orderStatus)
      if (next + 1 < status_list.length - 1) {
         updateOrder({
            variables: {
               id,
               _set: { orderStatus: status_list[next + 1] },
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
            <Styles.Accordian isOpen={currentPanel === 'customer'}>
               <header>
                  <Text as="p">
                     {order.customer?.customerFirstName}&nbsp;
                     {order.customer?.customerLastName}
                  </Text>
                  <ToggleButton
                     type="customer"
                     current={currentPanel}
                     toggle={setCurrentPanel}
                  />
               </header>
               <main>
                  <Flex container alignItems="center">
                     <span>
                        <PhoneIcon size={14} color="#718096" />
                     </span>
                     <Spacer size="4px" xAxis />
                     <Text as="subtitle">{order.customer?.customerPhone}</Text>
                  </Flex>
                  <Spacer size="8px" />
                  <Flex container alignItems="center">
                     <span>
                        <EmailIcon size={14} color="#718096" />
                     </span>
                     <Spacer size="4px" xAxis />
                     <Text as="subtitle">
                        <a
                           target="__blank"
                           rel="noopener roreferrer"
                           href={`mailto:${order.customer?.customerEmail}`}
                        >
                           {order.customer?.customerEmail}
                        </a>
                     </Text>
                  </Flex>
                  {order?.customer?.customerAddress && (
                     <>
                        <Spacer size="8px" />
                        <Flex container>
                           <span>
                              <HomeIcon size={14} color="#718096" />
                           </span>
                           <Spacer size="4px" xAxis />
                           <Text as="subtitle">
                              {normalize(order?.customer?.customerAddress)}
                           </Text>
                        </Flex>
                     </>
                  )}
                  <Spacer size="8px" />
               </main>
            </Styles.Accordian>
            <Styles.Accordian isOpen={currentPanel === 'billing'}>
               <header>
                  <Text as="p">
                     Amount Paid: {currencyFmt(Number(order.amountPaid) || 0)}
                  </Text>
                  <ToggleButton
                     type="billing"
                     current={currentPanel}
                     toggle={setCurrentPanel}
                  />
               </header>
               <main>
                  <StyledStat>
                     <span>{t(address.concat('tax'))}</span>
                     <span>{currencyFmt(Number(order.tax) || 0)}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('discount'))}</span>
                     <span>{order.discount}</span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('delivery price'))}</span>
                     <span>
                        {currencyFmt(Number(order.deliveryPrice) || 0)}
                     </span>
                  </StyledStat>
                  <StyledStat>
                     <span>{t(address.concat('total'))}</span>
                     <span>{currencyFmt(Number(order.amountPaid) || 0)}</span>
                  </StyledStat>
               </main>
            </Styles.Accordian>
         </section>
         <StyledProducts>
            <Flex as="header" container alignItems="center">
               <Flex
                  container
                  width="28px"
                  height="28px"
                  alignItems="center"
                  justifyContent="center"
               >
                  {isPickup(order.fulfillmentType) ? (
                     <img
                        alt="Pick Up"
                        width="28px"
                        title="Pick Up"
                        src={pickUpIcon}
                     />
                  ) : (
                     <img
                        alt="Delivery"
                        width="28px"
                        title="Delivery"
                        src={deliveryIcon}
                     />
                  )}
               </Flex>
               <Spacer size="8px" xAxis />
               <ComboButton
                  size="sm"
                  type="outline"
                  onClick={() => createTab(id)}
               >
                  {'ORD' + order.id}
                  <NewTabIcon size={14} />
               </ComboButton>
               <Spacer size="8px" xAxis />
               <IconButton size="sm" type="outline" onClick={() => print()}>
                  <PrintIcon size={16} />
               </IconButton>
               {!isPickup(order.fulfillmentType) && (
                  <>
                     <Spacer size="8px" xAxis />
                     <TextButton
                        size="sm"
                        type="outline"
                        fallBackMessage="Pending order confirmation!"
                        hasAccess={Boolean(
                           order.isAccepted && !order.isRejected
                        )}
                        onClick={() =>
                           dispatch({
                              type: 'DELIVERY_PANEL',
                              payload: { orderId: order.id },
                           })
                        }
                     >
                        {order?.deliveryCompany?.name ? 'View' : 'Select'}{' '}
                        Delivery
                     </TextButton>
                  </>
               )}
               <Spacer size="24px" xAxis />
               <Flex as="section" container alignItems="center">
                  <StyledStatus>
                     <span>{t(address.concat('ordered on'))}:&nbsp;</span>
                     <span>{formatDate(order?.created_at)}</span>
                  </StyledStatus>
                  <Spacer size="16px" xAxis />
                  <ReadyBy data={order?.pickupWindow} />
                  <Spacer size="16px" xAxis />
                  <TimeSlot
                     type={order.fulfillmentType}
                     data={{
                        pickup: order?.pickupWindow,
                        dropoff: order?.dropoffWindow,
                     }}
                  />
               </Flex>
            </Flex>
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
                     {!isEmpty(mealkits) && <StyledTab>
                        {t(address.concat('meal kits'))}{' '}
                        <StyledCount>{mealkits.length || 0}</StyledCount>
                     </StyledTab>}
                     {!isEmpty(readytoeats) && <StyledTab>
                        {t(address.concat('ready to eat'))}{' '}
                        <StyledCount>{readytoeats.length}</StyledCount>
                     </StyledTab>}
                     {!isEmpty(inventories) && <StyledTab>
                        {t(address.concat('inventory'))}{' '}
                        <StyledCount>{inventories.length || 0}</StyledCount>
                     </StyledTab>}
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
                     {!isEmpty(mealkits) && <StyledTabPanel>
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
                     </StyledTabPanel>}
                     {!isEmpty(readytoeats) && <StyledTabPanel>
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
                     </StyledTabPanel>}
                     {!isEmpty(inventories) && <StyledTabPanel>
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
                     </StyledTabPanel>}
                  </StyledTabPanels>
               </StyledTabs>
            </main>
         </StyledProducts>
         <Flex padding="8px">
            <Text as="h3">Actions</Text>
            <Spacer size="16px" />
            <Flex>
               <TextButton
                  type="solid"
                  disabled={order.isAccepted}
                  onClick={() =>
                     updateOrder({
                        variables: {
                           id,
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
               <TextButton
                  type="ghost"
                  onClick={() =>
                     updateOrder({
                        variables: {
                           id,
                           _set: {
                              isRejected: !order.isRejected,
                           },
                        },
                     })
                  }
               >
                  {order.isRejected ? 'Un Reject' : 'Reject'}
               </TextButton>
            </Flex>
         </Flex>
         <StyledStatusBadge status={orderStatus} onClick={updateStatus}>
            {orderStatus.split('_').join(' ')}
            <span>
               <RightIcon size={20} color="#fff" />
            </span>
         </StyledStatusBadge>
      </StyledOrderItem>
   )
}

export default OrderListItem

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
            {data?.approved?.startsAt
               ? formatDate(data?.approved?.startsAt)
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}

const TimeSlot = ({ type, data: { pickup, dropoff } = {} }) => {
   const { t } = useTranslation()

   const data = isPickup(type) ? pickup : dropoff
   return (
      <StyledStatus>
         <span>
            {isPickup(type)
               ? t(address.concat('pickup'))
               : t(address.concat('Delivery'))}
            :&nbsp;
         </span>
         <span>
            {data?.approved?.startsAt
               ? formatDate(data?.approved?.startsAt, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                 })
               : 'N/A'}
            ,&nbsp;
            {data?.approved?.startsAt
               ? formatDate(data?.approved?.startsAt, {
                    minute: 'numeric',
                    hour: 'numeric',
                 })
               : 'N/A'}
            -
            {data?.approved?.endsAt
               ? formatDate(data?.approved?.endsAt, {
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
