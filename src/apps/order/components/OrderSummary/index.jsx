import React from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import {
   Flex,
   Text,
   Spacer,
   ClearIcon,
   IconButton,
   TextButton,
} from '@dailykit/ui'

import { useOrder } from '../../context'
import { MetricItem } from '../MetricItem'
import { Wrapper, FilterSection } from './styled'
import { logger, currencyFmt } from '../../../../shared/utils'
import { InlineLoader, ErrorState } from '../../../../shared/components'
import { ORDER_BY_STATUS, STATION, ALL_ORDERS_AGGREGATE } from '../../graphql'

const address = 'apps.order.components.ordersummary.'

export const OrderSummary = () => {
   const { t } = useTranslation()
   const { state, dispatch } = useOrder()
   const { data: { orders = {} } = {} } = useSubscription(ALL_ORDERS_AGGREGATE)
   const {
      loading,
      error,
      data: { orderByStatus = [] } = {},
   } = useSubscription(ORDER_BY_STATUS)
   const { data: { station = {} } = {} } = useQuery(STATION, {
      variables: {
         id:
            state.orders.where?._or?.length > 0 &&
            state.orders.where?._or[0]?.orderInventoryProducts
               ?.assemblyStationId?._eq,
      },
   })

   const clearFilters = () => {
      dispatch({ type: 'CLEAR_READY_BY_FILTER' })
      dispatch({ type: 'CLEAR_FULFILLMENT_FILTER' })
      dispatch({ type: 'CLEAR_FULFILLMENT_TYPE_FILTER' })
      dispatch({ type: 'CLEAR_SOURCE_FILTER' })
      dispatch({ type: 'CLEAR_AMOUNT_FILTER' })
      dispatch({ type: 'CLEAR_STATION_FILTER' })
   }

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch the order summary!')
      return <ErrorState message="Failed to fetch the order summary!" />
   }
   return (
      <Wrapper>
         <Spacer size="8px" />
         <Text as="h4">{t(address.concat('quick info'))}</Text>
         <Spacer size="8px" />
         <MetricItem
            title="ALL"
            variant="ALL"
            currency="usd"
            count={orders?.aggregate?.count}
            amount={orders?.aggregate?.sum?.amount}
            average={orders?.aggregate?.avg?.amountPaid}
         />
         <ul>
            {orderByStatus.map(({ value, orders }) => (
               <MetricItem
                  key={value}
                  currency="usd"
                  variant={value}
                  count={orders.aggregate.count}
                  title={value.split('_').join(' ')}
                  amount={orders.aggregate.sum.amount || 0}
                  average={orders.aggregate.avg.amountPaid || 0}
               />
            ))}
         </ul>
         <Flex container alignItems="center" justifyContent="space-between">
            <Text as="h4">Advanced Filters</Text>
            <Flex container alignItems="center">
               <IconButton
                  size="sm"
                  type="ghost"
                  onClick={() => clearFilters()}
               >
                  <ClearIcon color="#000" />
               </IconButton>
               <Spacer size="8px" xAxis />
               <TextButton
                  size="sm"
                  type="outline"
                  onClick={() =>
                     dispatch({
                        type: 'TOGGLE_FILTER_TUNNEL',
                        payload: { tunnel: true },
                     })
                  }
               >
                  View
               </TextButton>
            </Flex>
         </Flex>
         <Spacer size="16px" />
         {state.orders.where?.readyByTimestamp &&
            Object.keys(state.orders.where?.readyByTimestamp).length > 0 && (
               <>
                  <FilterSection>
                     <h3>Ready By</h3>
                     <Flex container alignItems="center" margin="8px 0 0 0">
                        <span title="From">
                           {state.orders.where?.readyByTimestamp?._gte
                              ? moment(
                                   state.orders.where?.readyByTimestamp?._gte
                                ).format('HH:MM - MMM DD, YYYY')
                              : ''}
                        </span>
                        <Spacer size="16px" xAxis />
                        <span title="To">
                           {state.orders.where?.readyByTimestamp?._lte
                              ? moment(
                                   state.orders.where?.readyByTimestamp?._lte
                                ).format('HH:MM - MMM DD, YYYY')
                              : ''}
                        </span>
                     </Flex>
                  </FilterSection>
                  <Spacer size="16px" />
               </>
            )}
         {state.orders.where?.fulfillmentTimestamp &&
            Object.keys(state.orders.where?.fulfillmentTimestamp).length >
               0 && (
               <>
                  <FilterSection>
                     <h3>Fulfillment Time</h3>
                     <Flex container alignItems="center" margin="8px 0 0 0">
                        <span title="From">
                           {state.orders.where?.fulfillmentTimestamp?._gte
                              ? moment(
                                   state.orders.where?.fulfillmentTimestamp
                                      ?._gte
                                ).format('HH:MM - MMM DD, YYYY')
                              : ''}
                        </span>
                        <Spacer size="16px" xAxis />
                        <span title="To">
                           {state.orders.where?.fulfillmentTimestamp?._lte
                              ? moment(
                                   state.orders.where?.fulfillmentTimestamp
                                      ?._lte
                                ).format('HH:MM - MMM DD, YYYY')
                              : ''}
                        </span>
                     </Flex>
                  </FilterSection>
                  <Spacer size="16px" />
               </>
            )}
         {state.orders.where?.fulfillmentType &&
            Object.keys(state.orders.where?.fulfillmentType).length > 0 && (
               <>
                  <FilterSection>
                     <h3>Fulfillment Type</h3>
                     <Flex container alignItems="center" margin="8px 0 0 0">
                        <span>{state.orders.where?.fulfillmentType?._eq}</span>
                     </Flex>
                  </FilterSection>
                  <Spacer size="16px" />
               </>
            )}
         {state.orders.where?.source &&
            Object.keys(state.orders.where?.source).length > 0 && (
               <>
                  <FilterSection>
                     <h3>Source</h3>
                     <Flex container alignItems="center" margin="8px 0 0 0">
                        <span>{state.orders.where?.source?._eq}</span>
                     </Flex>
                  </FilterSection>
                  <Spacer size="16px" />
               </>
            )}
         {state.orders.where?.amountPaid &&
            Object.keys(state.orders.where?.amountPaid).length > 0 && (
               <>
                  <FilterSection>
                     <h3>Amount</h3>
                     <Flex container alignItems="center" margin="8px 0 0 0">
                        {state.orders.where?.amountPaid?._gte && (
                           <span>
                              {currencyFmt(
                                 state.orders.where?.amountPaid?._gte || 0
                              )}
                           </span>
                        )}
                        <Spacer size="16px" xAxis />
                        {state.orders.where?.amountPaid?._lte && (
                           <span>
                              {currencyFmt(
                                 state.orders.where?.amountPaid?._lte || 0
                              )}
                           </span>
                        )}
                     </Flex>
                  </FilterSection>
                  <Spacer size="16px" />
               </>
            )}
         {state.orders.where?._or?.length > 0 &&
            state.orders.where?._or[0]?.orderInventoryProducts &&
            Object.keys(state.orders.where?._or[0]?.orderInventoryProducts)
               .length > 0 && (
               <FilterSection>
                  <h3>Station</h3>
                  <Flex container alignItems="center" margin="8px 0 0 0">
                     <span>{station?.name}</span>
                  </Flex>
               </FilterSection>
            )}
      </Wrapper>
   )
}
