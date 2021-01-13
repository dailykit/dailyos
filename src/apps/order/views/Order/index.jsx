import React from 'react'
import axios from 'axios'
import { isEmpty, isNull } from 'lodash'
import { toast } from 'react-toastify'
import htmlToReact from 'html-to-react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import {
   Tag,
   Flex,
   Text,
   Spacer,
   Filler,
   TextButton,
   IconButton,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { Styles } from './styled'
import { formatDate } from '../../utils'
import { findAndSelectSachet } from './methods'
import { QUERIES, MUTATIONS } from '../../graphql'
import { PrintIcon, UserIcon } from '../../assets/icons'
import { useAccess } from '../../../../shared/providers'
import { useConfig, useOrder, useTabs } from '../../context'
import { currencyFmt, logger } from '../../../../shared/utils'
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
   const params = useParams()
   const { t } = useTranslation()
   const { isSuperUser } = useAccess()
   const { tab, addTab } = useTabs()
   const { state: config } = useConfig()
   const { state, switchView, dispatch } = useOrder()
   const [tabIndex, setTabIndex] = React.useState(0)
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

   const { loading: sourceLoading, data: { orderSource = [] } = {} } = useQuery(
      QUERIES.ORDER.SOURCE,
      {
         variables: {
            orderId: params.id,
         },
      }
   )

   const { loading, error, data: { order = {} } = {} } = useSubscription(
      QUERIES.ORDER.DETAILS,
      {
         variables: {
            id: params.id,
         },
         onSubscriptionData: ({
            subscriptionData: { data: { order = {} } = {} } = {},
         }) => {
            setIsThirdParty(Boolean(order?.thirdPartyOrderId))
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
      },
   })

   const {
      error: readytoeatsError,
      loading: readytoeatsLoading,
      data: { readytoeats = [] } = {},
   } = useSubscription(QUERIES.ORDER.READY_TO_EAT.LIST, {
      variables: {
         orderId: params.id,
      },
   })

   const {
      error: inventoriesError,
      loading: inventoriesLoading,
      data: { inventories = [] } = {},
   } = useSubscription(QUERIES.ORDER.INVENTORY.LIST, {
      variables: {
         orderId: params.id,
      },
   })

   React.useEffect(() => {
      if (!mealkitsLoading && !readytoeatsLoading && !inventoriesLoading) {
         const list = [
            !isEmpty(mealkits) && 'MEALKIT',
            !isEmpty(inventories) && 'INVENTORY',
            !isEmpty(readytoeats) && 'READYTOEAT',
         ].filter(Boolean)

         let isSelected = Boolean(state.current_product?.id)
         if (!isEmpty(mealkits)) {
            console.log('IN MEALKITS')
            if (!isSelected) {
               const [mealkit] = mealkits
               dispatch({ type: 'SELECT_PRODUCT', payload: mealkit })
               findAndSelectSachet({
                  dispatch,
                  isSuperUser,
                  product: mealkit,
                  station: config.current_station,
               })
               isSelected = true
               console.log('IN MEALKITS -> SELECT PRODUCT & SACHET')
            } else {
               const mealkit = mealkits.find(
                  node => node.id === state.current_product?.id
               )
               if (!isEmpty(mealkit)) {
                  findAndSelectSachet({
                     dispatch,
                     isSuperUser,
                     product: mealkit,
                     station: config.current_station,
                  })
                  setTabIndex(list.indexOf('MEALKIT'))
                  console.log('IN MEALKITS -> SELECT SACHET AND SWITCH TAB')
               }
            }
         }
         if (!isEmpty(inventories)) {
            console.log('IN INVENTORIES')
            if (!isSelected) {
               const [inventory] = inventories
               dispatch({ type: 'SELECT_PRODUCT', payload: inventory })
               findAndSelectSachet({
                  dispatch,
                  isSuperUser,
                  product: inventory,
                  station: config.current_station,
               })
               isSelected = true
               console.log('IN INVENTORIES -> SELECT PRODUCT & SACHET')
            } else {
               const inventory = inventories.find(
                  node => node.id === state.current_product?.id
               )
               if (!isEmpty(inventory)) {
                  findAndSelectSachet({
                     dispatch,
                     isSuperUser,
                     product: inventory,
                     station: config.current_station,
                  })
                  setTabIndex(list.indexOf('INVENTORY'))
                  console.log('IN INVENTORIES -> SELECT SACHET AND SWITCH TAB')
               }
            }
         }
         if (!isEmpty(readytoeats)) {
            console.log('IN READYTOEATS')
            if (!isSelected) {
               const [readytoeat] = readytoeats
               dispatch({ type: 'SELECT_PRODUCT', payload: readytoeat })
               findAndSelectSachet({
                  dispatch,
                  isSuperUser,
                  product: readytoeat,
                  station: config.current_station,
               })
               isSelected = true
               console.log('IN READYTOEATS -> SELECT PRODUCT & SACHET')
            } else {
               const readytoeat = readytoeats.find(
                  node => node.id === state.current_product?.id
               )
               if (!isEmpty(readytoeat)) {
                  findAndSelectSachet({
                     dispatch,
                     isSuperUser,
                     product: readytoeat,
                     station: config.current_station,
                  })
                  setTabIndex(list.indexOf('READYTOEAT'))
                  console.log('IN READYTOEATS -> SELECT SACHET AND SWITCH TAB')
               }
            }
         }
      }
   }, [
      mealkits,
      mealkitsLoading,
      readytoeats,
      readytoeatsLoading,
      inventories,
      inventoriesLoading,
   ])

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
               {!isThirdParty && Boolean(order?.cart?.isTest) && (
                  <>
                     <Spacer size="8px" xAxis />
                     <Tag>Test</Tag>
                  </>
               )}
               {!sourceLoading && isThirdParty && !isEmpty(orderSource) && (
                  <>
                     <Spacer size="16px" xAxis />
                     <Flex container alignItems="center">
                        <Text as="h4">Source:</Text>
                        <Spacer size="8px" xAxis />
                        <Flex
                           as="span"
                           container
                           width="24px"
                           height="24px"
                           alignItems="center"
                           justifyContent="center"
                        >
                           <img
                              alt={orderSource[0]?.thirdPartyCompany?.title}
                              src={orderSource[0]?.thirdPartyCompany?.imageUrl}
                              style={{
                                 height: '100%',
                                 width: '100%',
                                 objectFit: 'contain',
                              }}
                           />
                        </Flex>
                        <Spacer size="8px" xAxis />
                        <Text as="p" style={{ textTransform: 'capitalize' }}>
                           {orderSource[0]?.thirdPartyCompany?.title}
                        </Text>
                     </Flex>
                     <Spacer size="16px" xAxis />
                     <Flex container alignItems="center">
                        <Text as="h4">Third Party Order Id:</Text>
                        <Spacer size="8px" xAxis />
                        <Text as="p">
                           {order.thirdPartyOrder?.thirdPartyOrderId}
                        </Text>
                     </Flex>
                  </>
               )}
               <Spacer size="16px" xAxis />
               {!isThirdParty && (
                  <IconButton size="sm" type="outline" onClick={print}>
                     <PrintIcon size={16} />
                  </IconButton>
               )}
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
               <Spacer size="16px" xAxis />
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
                     {/* 
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
                  */}
                     <Spacer size="32px" xAxis />
                     <Flex as="section" container alignItems="center">
                        <TimeSlot
                           type={order?.fulfillmentType}
                           data={{
                              pickup: order.pickup,
                              dropoff: order.dropoff,
                           }}
                        />
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
         <Spacer size="8px" />
         {isThirdParty ? (
            <HorizontalTabs>
               <HorizontalTabList style={{ padding: '0 16px' }}>
                  <HorizontalTab>Email Content</HorizontalTab>
                  <HorizontalTab>Products</HorizontalTab>
               </HorizontalTabList>
               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     {parser.parse(order?.thirdPartyOrder?.emailContent)}
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     {isNull(order.thirdPartyOrder.products) ? (
                        <Filler message="No products available." />
                     ) : (
                        <Styles.Products>
                           {order.thirdPartyOrder.products.map(
                              (product, index) => (
                                 <Styles.ProductItem key={index}>
                                    <Flex
                                       container
                                       alignItems="center"
                                       justifyContent="space-between"
                                    >
                                       <span>{product.label}</span>
                                       <span>
                                          {currencyFmt(product.price || 0)}
                                       </span>
                                    </Flex>
                                    <Spacer size="14px" />
                                    <Flex container alignItems="center">
                                       <Flex
                                          as="span"
                                          container
                                          alignItems="center"
                                       >
                                          <UserIcon size={16} />
                                       </Flex>
                                       <Spacer size="6px" xAxis />
                                       <span>{product.quantity}</span>
                                    </Flex>
                                 </Styles.ProductItem>
                              )
                           )}
                        </Styles.Products>
                     )}
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         ) : (
            <HorizontalTabs
               index={tabIndex}
               onChange={index => setTabIndex(index)}
            >
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

const TimeSlot = ({ type, data: { pickup = {}, dropoff = {} } = {} }) => {
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
      <Flex as="section" container alignItems="center">
         <Flex container alignItems="center">
            <Text as="h4">{isPickup(type) ? 'Pick Up' : 'Delivery'}</Text>
            <Tooltip identifier="order_details_date_fulfillment" />
         </Flex>
         <Text as="p">
            &nbsp;:&nbsp;
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
         </Text>
      </Flex>
   )
}
