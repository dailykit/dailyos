import { useSubscription } from '@apollo/react-hooks'
import { isEmpty } from 'lodash'
import React from 'react'
import { InlineLoader } from '../../../../shared/components'
import { useOrder } from '../../context'
import { QUERIES } from '../../graphql'
import { StyledStat } from '../ProcessSachet/styled'
import { SachetWrapper } from './styled'

const SachetBar = ({ openOrderSummaryTunnel }) => {
   const {
      state: {
         sachet: { id },
      },
   } = useOrder()

   const [sachet, setSachet] = React.useState(null)
   const { loading, error } = useSubscription(QUERIES.ORDER.SACHET.ONE, {
      variables: { id },
      onSubscriptionData: async ({
         subscriptionData: { data: { orderSachet = {} } = {} },
      }) => {
         if (!isEmpty(orderSachet)) {
            setSachet(orderSachet)
         }
      },
   })
   if (loading || !sachet) return <InlineLoader />

   return (
      <SachetWrapper onClick={() => openOrderSummaryTunnel(1)}>
         <section>
            <h4>{sachet.ingredientName}</h4>
            <StyledStat status={sachet.status}>{sachet.status}</StyledStat>
         </section>
         <section>
            <section>
               <span>Supplier Item</span>
               <span>
                  {(sachet.bulkItemId &&
                     sachet?.bulkItem?.supplierItem?.name) ||
                     ''}
                  {(sachet.sachetItemId &&
                     sachet?.sachetItem?.bulkItem?.supplierItem?.name) ||
                     ''}
                  {!sachet?.bulkItemId && !sachet?.sachetItemId && 'NA'}
               </span>
            </section>
            <section>
               <span>Processing Name</span>
               <span>{sachet.processingName}</span>
            </section>
            <section>
               <span>Quantity</span>
               <span>
                  {sachet.quantity}
                  {sachet.unit}
               </span>
            </section>
         </section>
      </SachetWrapper>
   )
}

export default SachetBar
