import React from 'react'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import {
   Flex,
   Spacer,
   Text,
   TextButton,
   IconButton,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { formatDate } from '../../utils'
import { PrintIcon } from '../../assets/icons'
import { useOrder, useTabs } from '../../context'
import { logger } from '../../../../shared/utils'
import {
   ORDER_DETAILS,
   ORDER_MEALKITS,
   ORDER_INVENTORIES,
   ORDER_READYTOEATS,
} from '../../graphql'
import { MealKits, Inventories, ReadyToEats } from './sections'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
   DropdownButton,
} from '../../../../shared/components'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

const address = 'apps.order.views.order.'

const Order = () => {
   const { t } = useTranslation()
   const params = useParams()
   const { tab, addTab } = useTabs()
   const { state, switchView, dispatch } = useOrder()

   const { loading, error, data: { order = {} } = {} } = useSubscription(
      ORDER_DETAILS,
      {
         variables: {
            id: params.id,
            ...(!isEmpty(state.orders.where?._or) && {
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
      }
   )

   const {
      error: mealkitsError,
      loading: mealkitsLoading,
      data: { mealkits = [] } = {},
   } = useSubscription(ORDER_MEALKITS, {
      variables: {
         orderId: params.id,
         ...(!isEmpty(state.orders.where?._or) && {
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
   })

   const {
      error: readytoeatsError,
      loading: readytoeatsLoading,
      data: { readytoeats = [] } = {},
   } = useSubscription(ORDER_READYTOEATS, {
      variables: {
         orderId: params.id,
         ...(!isEmpty(state.orders.where?._or) && {
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
   })

   const {
      error: inventoriesError,
      loading: inventoriesLoading,
      data: { inventories = [] } = {},
   } = useSubscription(ORDER_INVENTORIES, {
      variables: {
         orderId: params.id,
         ...(!isEmpty(state.orders.where?._or) && {
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
   })

   React.useEffect(() => {
      if (!loading && order?.id && !tab) {
         addTab(`ORD${order?.id}`, `/apps/order/orders/${order?.id}`)
      }
   }, [loading, order, tab, addTab])

   React.useEffect(() => {
      return () => switchView('SUMMARY')
   }, [switchView])

   const print = React.useCallback(() => {
      const template = encodeURIComponent(
         JSON.stringify({ name: 'bill1', type: 'bill', format: 'pdf' })
      )
      const data = encodeURIComponent(JSON.stringify({ id: order?.id }))
      window.open(
         `${process.env.REACT_APP_TEMPLATE_URL}?template=${template}&data=${data}`,
         '_blank'
      )
   }, [order])

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

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch order details!')
      return <ErrorState message="Failed to fetch order details!" />
   }
   return (
      <Flex>
         <Spacer size="16px" />
         <Flex
            container
            as="header"
            padding="0 16px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex container alignItems="center">
               <Text as="h4">ORD{order?.id}</Text>
               <Spacer size="16px" xAxis />
               <IconButton size="sm" type="outline" onClick={print}>
                  <PrintIcon size={16} />
               </IconButton>
               <Spacer size="16px" xAxis />
               {!isPickup(order?.fulfillmentType) && (
                  <TextButton
                     size="sm"
                     type="outline"
                     onClick={() =>
                        dispatch({
                           type: 'DELIVERY_PANEL',
                           payload: { orderId: order?.id },
                        })
                     }
                  >
                     View Delivery
                  </TextButton>
               )}
            </Flex>
            <Flex container alignItems="center" flexWrap="wrap">
               <Flex as="section" container alignItems="center">
                  <Flex container alignItems="center">
                     <Text as="h4">{t(address.concat('ordered'))}</Text>
                     <Tooltip identifier="order_details_date_ordered_on" />
                  </Flex>
                  <Text as="p">
                     &nbsp;:&nbsp;{formatDate(order?.created_at)}
                  </Text>
               </Flex>
               <Spacer size="32px" xAxis />
               <Flex as="section" container alignItems="center">
                  <Flex container alignItems="center">
                     <Text as="h4">{t(address.concat('ready by'))}</Text>
                     <Tooltip identifier="order_details_date_ready_by" />
                  </Flex>
                  <Text as="p">
                     &nbsp;:&nbsp;
                     {order?.deliveryInfo?.pickup?.window?.approved?.startsAt
                        ? formatDate(
                             order?.deliveryInfo?.pickup?.window?.approved
                                ?.startsAt
                          )
                        : 'N/A'}
                  </Text>
               </Flex>
               <Spacer size="32px" xAxis />
               <Flex as="section" container alignItems="center">
                  {isPickup(order?.fulfillmentType) ? (
                     <TimeSlot
                        type={order?.fulfillmentType}
                        data={order?.deliveryInfo?.pickup}
                     />
                  ) : (
                     <TimeSlot
                        type={order?.fulfillmentType}
                        data={order?.deliveryInfo?.dropoff}
                     />
                  )}
               </Flex>
            </Flex>
         </Flex>
         <Spacer size="16px" />
         <Flex
            container
            padding="0 16px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Text as="h3">
               {order.assembled_mealkits.aggregate.count +
                  order.assembled_readytoeats.aggregate.count +
                  order.assembled_inventories.aggregate.count}{' '}
               /{' '}
               {order.packed_mealkits.aggregate.count +
                  order.packed_readytoeats.aggregate.count +
                  order.packed_inventories.aggregate.count}{' '}
               /{' '}
               {order.total_mealkits.aggregate.count +
                  order.total_readytoeats.aggregate.count +
                  order.total_inventories.aggregate.count}
               &nbsp;{t(address.concat('items'))}
            </Text>
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
         <Spacer size="16px" />
         <HorizontalTabs>
            <HorizontalTabList style={{ padding: '0 16px' }}>
               <HorizontalTab>Meal Kits ({mealkits.length})</HorizontalTab>
               <HorizontalTab>Inventories ({inventories.length})</HorizontalTab>
               <HorizontalTab>
                  Ready To Eats ({order.total_readytoeats.aggregate.count})
               </HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <MealKits
                     data={{
                        mealkits,
                        error: mealkitsError,
                        loading: mealkitsLoading,
                     }}
                  />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <Inventories
                     data={{
                        inventories,
                        error: inventoriesError,
                        loading: inventoriesLoading,
                     }}
                  />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <ReadyToEats
                     data={{
                        readytoeats,
                        error: readytoeatsError,
                        loading: readytoeatsLoading,
                     }}
                  />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Flex>
   )
}

export default Order

const TimeSlot = ({ type, data = {} }) => {
   return (
      <Flex as="section" container alignItems="center">
         <Flex container alignItems="center">
            <Text as="h4">{isPickup(type) ? 'Pick Up' : 'Delivery'}</Text>
            <Tooltip identifier="order_details_date_fulfillment" />
         </Flex>
         <Text as="p">
            &nbsp;:&nbsp;
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
         </Text>
      </Flex>
   )
}
