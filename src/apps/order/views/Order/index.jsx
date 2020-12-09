import React from 'react'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import htmlToReact from 'html-to-react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useSubscription } from '@apollo/react-hooks'
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
import { QUERIES, MUTATIONS } from '../../graphql'
import { MealKits, Inventories, ReadyToEats } from './sections'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
   DropdownButton,
} from '../../../../shared/components'

const isPickup = value => ['ONDEMAND_PICKUP', 'PREORDER_PICKUP'].includes(value)

const address = 'apps.order.views.order.'
const parser = new htmlToReact.Parser(React)

const Order = () => {
   const { t } = useTranslation()
   const params = useParams()
   const { tab, addTab } = useTabs()
   const { state, switchView, dispatch } = useOrder()
   const [isThirdParty, setIsThirdParty] = React.useState(false)
   const [updateOrder] = useMutation(MUTATIONS.ORDER.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the order!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the order')
      },
   })

   const { loading, error, data: { order = {} } = {} } = useSubscription(
      QUERIES.ORDER.DETAILS,
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
   } = useSubscription(QUERIES.ORDER.MEALKITS, {
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
   } = useSubscription(QUERIES.ORDER.READY_TO_EAT.LIST, {
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
   } = useSubscription(QUERIES.ORDER.INVENTORY.LIST, {
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
         setIsThirdParty(Boolean(order?.thirdPartyOrderId))
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
               {!isThirdParty && !isPickup(order?.fulfillmentType) && (
                  <TextButton
                     size="sm"
                     type="outline"
                     fallBackMessage="Pending order confirmation!"
                     hasAccess={Boolean(order.isAccepted && !order.isRejected)}
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
               {!isThirdParty && (
                  <>
                     <Spacer size="32px" xAxis />
                     <Flex as="section" container alignItems="center">
                        <Flex container alignItems="center">
                           <Text as="h4">{t(address.concat('ready by'))}</Text>
                           <Tooltip identifier="order_details_date_ready_by" />
                        </Flex>
                        <Text as="p">
                           &nbsp;:&nbsp;
                           {order?.deliveryInfo?.pickup?.window?.approved
                              ?.startsAt
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
                  </>
               )}
            </Flex>
         </Flex>
         <Spacer size="16px" />
         <Flex
            container
            padding="0 16px"
            alignItems="center"
            justifyContent="space-between"
         >
            {!isThirdParty ? (
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
            ) : (
               <span />
            )}

            <Flex container>
               {!isThirdParty && (
                  <>
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
                     <Spacer size="24px" xAxis />
                  </>
               )}
               <TextButton
                  type="solid"
                  disabled={order.isAccepted}
                  onClick={() =>
                     updateOrder({
                        variables: {
                           id: order.id,
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
               <Spacer size="14px" xAxis />
               <TextButton
                  type="ghost"
                  onClick={() =>
                     updateOrder({
                        variables: {
                           id: order.id,
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
         <Spacer size="16px" />
         {isThirdParty ? (
            <HorizontalTabs>
               <HorizontalTabList style={{ padding: '0 16px' }}>
                  <HorizontalTab>Email Content</HorizontalTab>
               </HorizontalTabList>
               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     {parser.parse(order?.thirdPartyOrder?.emailContent)}
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         ) : (
            <HorizontalTabs>
               <HorizontalTabList style={{ padding: '0 16px' }}>
                  {!isEmpty(mealkits) && (
                     <HorizontalTab>
                        Meal Kits ({mealkits.length})
                     </HorizontalTab>
                  )}
                  {!isEmpty(inventories) && (
                     <HorizontalTab>
                        Inventories ({inventories.length})
                     </HorizontalTab>
                  )}
                  {!isEmpty(readytoeats) && (
                     <HorizontalTab>
                        Ready To Eats ({readytoeats.length})
                     </HorizontalTab>
                  )}
               </HorizontalTabList>
               <HorizontalTabPanels>
                  {!isEmpty(mealkits) && (
                     <HorizontalTabPanel>
                        <MealKits
                           data={{
                              mealkits,
                              error: mealkitsError,
                              loading: mealkitsLoading,
                           }}
                        />
                     </HorizontalTabPanel>
                  )}
                  {!isEmpty(inventories) && (
                     <HorizontalTabPanel>
                        <Inventories
                           data={{
                              inventories,
                              error: inventoriesError,
                              loading: inventoriesLoading,
                           }}
                        />
                     </HorizontalTabPanel>
                  )}
                  {!isEmpty(readytoeats) && (
                     <HorizontalTabPanel>
                        <ReadyToEats
                           data={{
                              readytoeats,
                              error: readytoeatsError,
                              loading: readytoeatsLoading,
                           }}
                        />
                     </HorizontalTabPanel>
                  )}
               </HorizontalTabPanels>
            </HorizontalTabs>
         )}
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
