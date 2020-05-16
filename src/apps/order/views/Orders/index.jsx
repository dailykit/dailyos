import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import { OrderListItem, OrderSummary } from '../../components'

import { useTabs } from '../../context/tabs'

import { Wrapper } from './styled'

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

   if (loading) return <div>Loading...</div>
   if (error) return <div>{error.message}</div>
   return (
      <Wrapper>
         <OrderSummary />
         <div>
            {loading ? (
               <div>Loading...</div>
            ) : (
               orders.map(order => (
                  <OrderListItem order={order} key={order.id} />
               ))
            )}
         </div>
      </Wrapper>
   )
}

export default Orders
