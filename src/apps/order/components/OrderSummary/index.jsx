import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { SUMMARY, ORDER_STATUSES } from '../../graphql'
import { MetricItem } from '../MetricItem'
import { Wrapper, StyledMode } from './styled'
import { useOrder } from '../../context/order'

export const OrderSummary = () => {
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

   if (loading) return <div>Loading...</div>
   if (error) return <div>{error.message}</div>
   return (
      <Wrapper>
         <StyledMode>
            <label htmlFor="mode">Mode</label>
            <select
               name="mode"
               value={current_view}
               onChange={e => changeView(e.target.value)}
            >
               <option value="SUMMARY">Summary</option>
               <option value="WEIGHING">Weighing</option>
            </select>
         </StyledMode>
         <h4>Quick Info</h4>
         {orders.length > 0 && Object.keys(orders[0]).length > 0 ? (
            <ul>
               <MetricItem
                  title="ALL ORDERS"
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
