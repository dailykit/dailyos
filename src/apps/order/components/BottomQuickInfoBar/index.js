import { useSubscription } from '@apollo/react-hooks'
import React from 'react'
import { logger, currencyFmt } from '../../../../shared/utils'
import { Wrapper } from './styled'
import { QUERIES } from '../../graphql'
import { InlineLoader, ErrorState } from '../../../../shared/components'
import { toast } from 'react-toastify'

const BottomQuickInfoBar = ({ openOrderSummaryTunnel }) => {
   const { data: { orders = {} } = {} } = useSubscription(
      QUERIES.ORDERS.AGGREGATE.TOTAL
   )
   const { data: { orders: cancelledOrders = {} } = {} } = useSubscription(
      QUERIES.ORDERS.AGGREGATE.CANCELLED
   )
   const {
      loading,
      error,
      data: { orderByStatus = [] } = {},
   } = useSubscription(QUERIES.ORDERS.AGGREGATE.BY_STATUS)

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch the order summary!')
      return <ErrorState message="Failed to fetch the order summary!" />
   }
   console.log(orders)
   console.log(orderByStatus)
   console.log(cancelledOrders)
   return (
      <Wrapper variant="ALL" onClick={() => openOrderSummaryTunnel(1)}>
         <header>
            <h2>{'ALL'}</h2>
            <span title="Average">{currencyFmt(Number(72.0) || 0)}</span>
         </header>
         <main>
            <span>{18}</span>
            <span title="Total">{currencyFmt(Number(5000) || 0)}</span>
         </main>
      </Wrapper>
   )
}

export default BottomQuickInfoBar
