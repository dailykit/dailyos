import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import { OrderListItem, OrderSummary, Loader } from '../../components'

import { useTabs } from '../../context/tabs'

import { ORDERS } from '../../graphql'

const Orders = () => {
   const history = useHistory()
   const { tabs } = useTabs()
   const { loading, error, data: { orders = [] } = {} } = useSubscription(
      ORDERS
   )
   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/order/orders`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/order')
      }
   }, [history, tabs])

   if (loading)
      return (
         <div>
            <Loader />
         </div>
      )
   if (error) return <div>{error.message}</div>
   return (
      <div>
         {orders.length > 0 ? (
            orders.map(order => <OrderListItem order={order} key={order.id} />)
         ) : (
            <div>No orders yet!</div>
         )}
      </div>
   )
}

export default Orders
