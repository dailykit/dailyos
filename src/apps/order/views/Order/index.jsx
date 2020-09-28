import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { ORDER } from '../../graphql'
import { formatDate } from '../../utils'
import { PrintIcon } from '../../assets/icons'
import { useOrder, useTabs } from '../../context'
import { MealKits, Inventories, ReadyToEats } from './sections'
import {
   Flex,
   InlineLoader,
   DropdownButton,
} from '../../../../shared/components'

import {
   Wrapper,
   Header,
   StyledCount,
   StyledTabs,
   StyledTabList,
   StyledTab,
   StyledTabPanels,
   StyledTabPanel,
   StyledPrint,
   StyledButton,
   StyledStatus,
} from './styled'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

const address = 'apps.order.views.order.'
const Order = () => {
   const { t } = useTranslation()
   const params = useParams()
   const { tab, addTab } = useTabs()
   const [order, setOrder] = React.useState(null)
   const { state, switchView, dispatch } = useOrder()
   const [mealkits, setMealKits] = React.useState([])
   const [inventories, setInventories] = React.useState([])
   const [readytoeats, setReadyToEats] = React.useState([])

   const { loading, error } = useSubscription(ORDER, {
      variables: {
         id: params.id,
         ...(!_.isEmpty(state.orders.where?._or) && {
            packingStationId: {
               _eq:
                  state.orders.where?._or[0].orderInventoryProducts
                     .assemblyStationId._eq,
            },
            assemblyStationId: {
               _eq:
                  state.orders.where?._or[0].orderInventoryProducts
                     .assemblyStationId._eq,
            },
         }),
      },
      onSubscriptionData: ({ subscriptionData: { data = {} } }) => {
         const {
            orderMealKitProducts,
            orderInventoryProducts,
            orderReadyToEatProducts,
            ...rest
         } = data.order
         setOrder(rest)

         setMealKits(orderMealKitProducts)
         setInventories(orderInventoryProducts)
         setReadyToEats(orderReadyToEatProducts)
      },
   })

   React.useEffect(() => {
      if (!loading && order && !tab) {
         addTab(`ORD${order.id}`, `/apps/order/orders/${order.id}`)
      }
   }, [loading, order, tab, addTab])

   React.useEffect(() => {
      return () => switchView('SUMMARY')
   }, [switchView])

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

   const printKOT = async () => {
      try {
         const url = `${
            new URL(process.env.REACT_APP_DATA_HUB_URI).origin
         }/datahub/v1/query`
         await axios.post(
            url,
            {
               type: 'invoke_event_trigger',
               args: {
                  name: 'printKOT',
                  payload: {
                     new: {
                        id: order.id,
                        orderStatus: 'UNDER_PROCESSING',
                     },
                  },
               },
            },
            {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'x-hasura-admin-secret':
                     process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
               },
            }
         )
      } catch (error) {
         console.log(error)
      }
   }

   const viewKOT = React.useCallback(() => {
      const kots = async () => {
         try {
            const { data: { data = {}, success } = {} } = await axios.get(
               `${process.env.REACT_APP_DAILYOS_SERVER_URI}/api/kot-urls?id=${order.id}`
            )
            if (success) {
               data.forEach(node => window.open(node.url, '_blank'))
            }
         } catch (error) {
            console.log('viewKOT -> error', error)
         }
      }
      kots()
   }, [order])

   if (loading || !order)
      return (
         <Wrapper>
            <InlineLoader />
         </Wrapper>
      )
   if (error)
      return <Wrapper>{t(address.concat('something went wrong!'))}</Wrapper>
   return (
      <Wrapper>
         <Header>
            <h3>
               <span>{t(address.concat('order no'))}</span>: ORD{order.id}
            </h3>
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
                  View Delivery
               </StyledButton>
            )}
            <section>
               <section>
                  <span>{t(address.concat('ordered'))}:&nbsp;</span>
                  <span>{formatDate(order.created_at)}</span>
               </section>
               <section>
                  <span>{t(address.concat('ready by'))}:&nbsp;</span>
                  <span>
                     {order.deliveryInfo?.pickup?.window?.approved?.startsAt
                        ? formatDate(
                             order.deliveryInfo?.pickup?.window?.approved
                                ?.startsAt
                          )
                        : 'N/A'}
                  </span>
               </section>
               <section>
                  {isPickup(order.fulfillmentType) ? (
                     <TimeSlot
                        type={order.fulfillmentType}
                        data={order.deliveryInfo?.pickup}
                     />
                  ) : (
                     <TimeSlot
                        type={order.fulfillmentType}
                        data={order.deliveryInfo?.dropoff}
                     />
                  )}
               </section>
            </section>
         </Header>
         <section>
            <Flex container alignItems="center" justifyContent="space-between">
               <StyledCount>
                  0 /{' '}
                  {inventories.length + mealkits.length + readytoeats.length}
                  &nbsp;{t(address.concat('items'))}
               </StyledCount>
               <Flex width="240px">
                  <DropdownButton title="KOT Options">
                     <DropdownButton.Options>
                        <DropdownButton.Option onClick={() => printKOT()}>
                           Print KOT
                        </DropdownButton.Option>
                        <DropdownButton.Option onClick={() => viewKOT()}>
                           View in browser
                        </DropdownButton.Option>
                     </DropdownButton.Options>
                  </DropdownButton>
               </Flex>
            </Flex>
            <StyledTabs>
               <StyledTabList>
                  <StyledTab>Meal Kits ({mealkits.length})</StyledTab>
                  <StyledTab>Inventories ({inventories.length})</StyledTab>
                  <StyledTab>Ready To Eats ({readytoeats.length})</StyledTab>
               </StyledTabList>
               <StyledTabPanels>
                  <StyledTabPanel>
                     <MealKits mealkits={mealkits} />
                  </StyledTabPanel>
                  <StyledTabPanel>
                     <Inventories inventories={inventories} />
                  </StyledTabPanel>
                  <StyledTabPanel>
                     <ReadyToEats readytoeats={readytoeats} />
                  </StyledTabPanel>
               </StyledTabPanels>
            </StyledTabs>
         </section>
      </Wrapper>
   )
}

export default Order

const TimeSlot = ({ type, data = {} }) => {
   return (
      <StyledStatus>
         <span>{isPickup(type) ? 'Pick Up' : 'Delivery'}:</span>
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
