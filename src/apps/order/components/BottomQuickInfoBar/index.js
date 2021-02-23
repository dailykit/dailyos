import { useSubscription } from '@apollo/react-hooks'
import React from 'react'
import { logger, currencyFmt } from '../../../../shared/utils'
import { Wrapper } from './styled'
import { QUERIES } from '../../graphql'
import { InlineLoader, ErrorState } from '../../../../shared/components'
import { toast } from 'react-toastify'
import { useOrder } from '../../context'
import SachetBar from './SachetBar'

const BottomQuickInfoBar = ({ openOrderSummaryTunnel }) => {
   const { state } = useOrder()
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

   const getCardText = () => {
      const activeStatusCard = state.orders.where?.orderStatus?._eq
      const isAllActive = state.orders?.where?._or.find(
         el => el.isRejected?._eq === false
      )

      const cardText = {}

      if (activeStatusCard) {
         const { value, orders } = orderByStatus.find(
            el => el.value === activeStatusCard
         )
         cardText.title = value.split('_').join(' ')
         cardText.count = orders.aggregate.count
         cardText.amount = orders.aggregate.sum.amount || 0
         cardText.average = orders.aggregate.avg.amountPaid || 0
      } else if (isAllActive) {
         cardText.title = 'ALL'
         cardText.count = orders.aggregate.count
         cardText.amount = orders.aggregate.sum.amountPaid || 0
         cardText.average = orders.aggregate.avg.amountPaid || 0
      } else {
         cardText.title = 'REJECTED OR CANCELLED'
         cardText.count = cancelledOrders.aggregate.count
         cardText.amount = cancelledOrders.aggregate.sum.amountPaid || 0
         cardText.average = cancelledOrders.aggregate.avg.amountPaid || 0
      }
      return cardText
   }
   const { title, count, amount, average } = getCardText()
   return (
      <>
         {state.current_view === 'SUMMARY' && (
            <Wrapper variant={title} onClick={() => openOrderSummaryTunnel(1)}>
               <header>
                  <h2>{title}</h2>
                  <span title="Average">
                     {currencyFmt(Number(average) || 0)}
                  </span>
               </header>
               <main>
                  <span>{count}</span>
                  <span title="Total">{currencyFmt(Number(amount) || 0)}</span>
               </main>
            </Wrapper>
         )}
         {state.current_view === 'SACHET_ITEM' && (
            <SachetBar openOrderSummaryTunnel={openOrderSummaryTunnel} />
         )}
      </>
   )
}

export default BottomQuickInfoBar
