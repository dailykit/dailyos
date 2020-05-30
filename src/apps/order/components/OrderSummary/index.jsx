import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { ORDERS_SUMMARY, ORDER_STATUSES } from '../../graphql'
import { MetricItem } from '../MetricItem'
import { Wrapper } from './styled'
import { useTranslation } from 'react-i18next'

const address = 'apps.order.components.ordersummary.'
export const OrderSummary = ({ onStatusSelect }) => {
   const { t } = useTranslation()
   const { loading, error, data: { orders = [] } = {} } = useSubscription(
      ORDERS_SUMMARY
   )

   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(ORDER_STATUSES)

   if (loading) return <div>{t(address.concat('loading'))}...</div>
   if (error) return <div>{error.message}</div>
   return (
      <Wrapper>
         <h4>{t(address.concat('quick info'))}</h4>
         {orders.length > 0 && Object.keys(orders[0]).length > 0 ? (
            <ul>
               <MetricItem
                  title={t(address.concat("all orders"))}
                  currency={orders[0].currency}
                  count={Object.keys(orders[0].summary.count).reduce(
                     (sum, key) =>
                        sum + Number(orders[0].summary.count[key] || 0),
                     0
                  )}
                  amount={Object.keys(orders[0].summary.amount).reduce(
                     (sum, key) =>
                        sum + parseFloat(orders[0].summary.amount[key] || 0),
                     0
                  )}
                  variant="ALL"
               />

               {statuses.map(({ value }) => (
                  <MetricItem
                     key={value}
                     currency={orders[0].currency}
                     title={value.split('_').join(' ')}
                     count={orders[0].summary.count[value] || 0}
                     amount={orders[0].summary.amount[value] || 0}
                     variant={value}
                  />
               ))}
            </ul>
         ) : (
               <div>No orders yet!</div>
            )}
      </Wrapper>
   )
}
