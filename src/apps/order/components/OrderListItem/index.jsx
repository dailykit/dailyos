import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import { Styles } from './styled'
import { RightIcon } from '../../assets/icons'
import { logger } from '../../../../shared/utils'
import { QUERIES, MUTATIONS } from '../../graphql'
import { Details, Products, Actions, Header } from './sections'

const OrderListItem = ({ containerId, order = {} }) => {
   const [updateCart] = useMutation(MUTATIONS.CART.UPDATE.ONE, {
      onCompleted: () => {
         toast.success('Successfully updated the order!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to update the order')
      },
   })
   const {
      data: { order_orderStatusEnum: statuses = [] } = {},
   } = useSubscription(QUERIES.ORDER.STATUSES)

   const updateStatus = () => {
      if (Boolean(order.isAccepted !== true && order.isRejected !== true)) {
         toast.error('Pending order confirmation!')
         return
      }
      if (order.cart?.status === 'ORDER_DELIVERED') return
      const status_list = statuses.map(status => status.value)
      const next = status_list.indexOf(order.cart?.status)
      if (next + 1 < status_list.length - 1) {
         updateCart({
            variables: {
               pk_columns: { id: order.cart.id },
               _set: { status: status_list[next + 1] },
            },
         })
      }
   }

   return (
      <Styles.Order status={order.cart?.status} id={containerId}>
         <Details order={order} />
         <Header order={order} />
         <Products order={order} />
         <Actions order={order} />
         <Styles.Status status={order.cart?.status} onClick={updateStatus}>
            {order.cart?.orderStatus?.title}
            <span>
               <RightIcon size={20} color="#fff" />
            </span>
         </Styles.Status>
      </Styles.Order>
   )
}

export default OrderListItem
