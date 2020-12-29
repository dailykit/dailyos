import React from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/react-hooks'
import {
   Text,
   Flex,
   Spacer,
   IconButton,
   TextButton,
   ComboButton,
} from '@dailykit/ui'

import { StyledStatus } from './styled'
import { QUERIES } from '../../../graphql'
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
            {'ORD' + order.id + (Boolean(order?.cart?.isTest) ? '(Test)' : '')}
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
                  {/* <Spacer size="16px" xAxis />
                  <ReadyBy data={order?.pickupWindow} /> */}
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

const TimeSlot = ({ type, data: { pickup = {}, dropoff = {} } = {} }) => {
   const { t } = useTranslation()

   let startsAt = ''
   let endsAt = ''
   if (isPickup(type)) {
      startsAt = pickup?.approved?.startsAt || ''
      endsAt = pickup?.approved?.endsAt || ''
   } else {
      startsAt = dropoff?.requested?.startsAt || ''
      endsAt = dropoff?.requested?.endsAt || ''
   }
   return (
      <StyledStatus>
         <span>
            {isPickup(type)
               ? t(address.concat('pickup'))
               : t(address.concat('Delivery'))}
            :&nbsp;
         </span>
         <span>
            {startsAt
               ? formatDate(startsAt, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                 })
               : 'N/A'}
            ,&nbsp;
            {startsAt
               ? formatDate(startsAt, {
                    minute: 'numeric',
                    hour: 'numeric',
                 })
               : 'N/A'}
            -
            {endsAt
               ? formatDate(endsAt, {
                    minute: 'numeric',
                    hour: 'numeric',
                 })
               : 'N/A'}
         </span>
      </StyledStatus>
   )
}
