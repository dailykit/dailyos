import React from 'react'
import { useTranslation } from 'react-i18next'
import {
   Text,
   Flex,
   Spacer,
   IconButton,
   TextButton,
   ComboButton,
} from '@dailykit/ui'

import { StyledStatus } from './styled'
import { formatDate } from '../../../utils'
import { useTabs, useOrder } from '../../../context'
import pickUpIcon from '../../../assets/svgs/pickup.png'
import deliveryIcon from '../../../assets/svgs/delivery.png'
import { NewTabIcon, PrintIcon } from '../../../assets/icons'

const address = 'apps.order.components.orderlistitem.'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

export const Header = ({ order }) => {
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
         {!order.thirdPartyOrderId && (
            <>
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
            </>
         )}
         <ComboButton
            size="sm"
            type="outline"
            onClick={() => createTab(order.id)}
         >
            {'ORD' + order.id}
            <NewTabIcon size={14} />
         </ComboButton>
         <Spacer size="8px" xAxis />
         {!order.thirdPartyOrderId && (
            <IconButton size="sm" type="outline" onClick={() => print()}>
               <PrintIcon size={16} />
            </IconButton>
         )}
         {!order.thirdPartyOrderId && !isPickup(order.fulfillmentType) && (
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
            {!order.thirdPartyOrderId && (
               <>
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
               </>
            )}
         </Flex>
         <Spacer size="16px" xAxis />
         {order.thirdPartyOrderId && (
            <Flex container alignItems="center">
               <StyledStatus>
                  <span>Source:</span>
               </StyledStatus>
               <Flex
                  as="span"
                  container
                  width="24px"
                  height="24px"
                  alignItems="center"
                  justifyContent="center"
               >
                  <img
                     alt={order.thirdPartyOrder?.orderSource?.title}
                     src={order.thirdPartyOrder?.orderSource?.imageUrl}
                     style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                     }}
                  />
               </Flex>
               <Spacer size="8px" xAxis />
               <Text as="p" style={{ textTransform: 'capitalize' }}>
                  {order.thirdPartyOrder?.orderSource?.title}
               </Text>
            </Flex>
         )}
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
