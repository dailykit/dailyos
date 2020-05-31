import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import Loader from '../Loader'
import { MetricItem } from '../MetricItem'
import { Wrapper, StyledMode } from './styled'
import { useOrder } from '../../context/order'
import { SUMMARY, ORDER_STATUSES } from '../../graphql'
import { useTranslation } from 'react-i18next'
const address = 'apps.order.components.ordersummary.'
export const OrderSummary = () => {
   const { t } = useTranslation()
   const {
      state: { current_view },
      switchView,
   } = useOrder()
   const { loading, error, data: { orders = [] } = {} } = useSubscription(
      SUMMARY
   )

   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(ORDER_STATUSES)

   const changeView = view => {
      switchView(view)
   }

   if (loading)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error) return <Wrapper>{error.message}</Wrapper>
   return (
      <Wrapper>
         <StyledMode>
            <label htmlFor="mode">{t(address.concat('mode'))}</label>
            <select
               name="mode"
               value={current_view}
               onChange={e => changeView(e.target.value)}
            >
               <option value="SUMMARY">{t(address.concat('summary'))}</option>
               <option value="WEIGHING">{t(address.concat('weighing'))}</option>
            </select>
         </StyledMode>
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
               <div>{t(address.concat('no orders yet!'))}</div>
            )}
      </Wrapper>
   )
}
