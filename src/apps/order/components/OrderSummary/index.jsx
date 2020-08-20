import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import Loader from '../Loader'
import { MetricItem } from '../MetricItem'
import { Wrapper } from './styled'
import { ORDER_BY_STATUS, ORDER_STATUSES } from '../../graphql'

const address = 'apps.order.components.ordersummary.'
export const OrderSummary = () => {
   const { t } = useTranslation()
   const {
      loading,
      error,
      data: { orderByStatus = [] } = {},
   } = useSubscription(ORDER_BY_STATUS)

   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(ORDER_STATUSES)

   if (loading)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error) return <Wrapper>{error.message}</Wrapper>
   return (
      <Wrapper>
         <h4>{t(address.concat('quick info'))}</h4>
         {orderByStatus.length > 0 ? (
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
         ) : (
            <div>{t(address.concat('no orders yet!'))}</div>
         )}
      </Wrapper>
   )
}
