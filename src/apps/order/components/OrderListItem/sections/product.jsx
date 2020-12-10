import React from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Flex, Spacer, IconButton, TextButton, ComboButton } from '@dailykit/ui'

import {
   Styles,
   StyledCount,
   StyledProductItem,
   StyledProductTitle,
   StyledProducts,
   StyledServings,
   StyledStatus,
   StyledTabs,
   StyledTab,
   StyledTabList,
   StyledTabPanels,
   StyledTabPanel,
} from './styled'
import { formatDate } from '../../../utils'
import { useTabs, useOrder } from '../../../context'
import pickUpIcon from '../../../assets/svgs/pickup.png'
import deliveryIcon from '../../../assets/svgs/delivery.png'
import { UserIcon, NewTabIcon, PrintIcon } from '../../../assets/icons'

const address = 'apps.order.components.orderlistitem.'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

export const Products = ({ order }) => {
   const { t } = useTranslation()
   const {
      orderMealKitProducts: mealkits = [],
      orderInventoryProducts: inventories = [],
      orderReadyToEatProducts: readytoeats = [],
   } = order

   return (
      <Styles.Products>
         <Header order={order} />
         <main>
            <Styles.Tabs>
               <Styles.TabList>
                  <Styles.Tab>
                     {t(address.concat('all'))}{' '}
                     <StyledCount>
                        0 /&nbsp;
                        {inventories.length +
                           mealkits.length +
                           readytoeats.length}
                        &nbsp;
                     </StyledCount>
                  </Styles.Tab>
                  {!isEmpty(mealkits) && (
                     <Styles.Tab>
                        {t(address.concat('meal kits'))}{' '}
                        <StyledCount>{mealkits.length || 0}</StyledCount>
                     </Styles.Tab>
                  )}
                  {!isEmpty(readytoeats) && (
                     <Styles.Tab>
                        {t(address.concat('ready to eat'))}{' '}
                        <StyledCount>{readytoeats.length}</StyledCount>
                     </Styles.Tab>
                  )}
                  {!isEmpty(inventories) && (
                     <Styles.Tab>
                        {t(address.concat('inventory'))}{' '}
                        <StyledCount>{inventories.length || 0}</StyledCount>
                     </Styles.Tab>
                  )}
               </Styles.TabList>
               <Styles.TabPanels>
                  <Styles.TabPanel>
                     {inventories.map(inventory => (
                        <StyledProductItem key={inventory.id}>
                           <div>
                              <ProductTitle data={inventory} type="INVENTORY" />
                           </div>
                           <StyledServings>
                              <span>
                                 <UserIcon size={16} color="#555B6E" />
                              </span>
                              <span>
                                 {inventory?.inventoryProductOption?.quantity}
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
                  </Styles.TabPanel>
                  {!isEmpty(mealkits) && (
                     <Styles.TabPanel>
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
                     </Styles.TabPanel>
                  )}
                  {!isEmpty(readytoeats) && (
                     <Styles.TabPanel>
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
                     </Styles.TabPanel>
                  )}
                  {!isEmpty(inventories) && (
                     <Styles.TabPanel>
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
                     </Styles.TabPanel>
                  )}
               </Styles.TabPanels>
            </Styles.Tabs>
         </main>
      </Styles.Products>
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

const Header = ({ order }) => {
   const { addTab } = useTabs()
   const { t } = useTranslation()
   const { dispatch } = useOrder()
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
            onClick={() => createTab(order.id)}
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
                  hasAccess={Boolean(order.isAccepted && !order.isRejected)}
                  onClick={() =>
                     dispatch({
                        type: 'DELIVERY_PANEL',
                        payload: { orderId: order.id },
                     })
                  }
               >
                  {order?.deliveryCompany?.name ? 'View' : 'Select'} Delivery
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
