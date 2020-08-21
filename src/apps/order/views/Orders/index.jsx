import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { ORDERS } from '../../graphql'
import { useOrder } from '../../context'
import { useTabs } from '../../context/tabs'
import { OrderListItem } from '../../components'
import { InlineLoader } from '../../../../shared/components'

const address = 'apps.order.views.orders.'
const Orders = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { state } = useOrder()
   const { tabs, addTab } = useTabs()
   const { loading, error, data: { orders = [] } = {} } = useSubscription(
      ORDERS,
      {
         variables: {
            where: state.orders.where,
         },
      }
   )
   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/apps/order/orders`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         addTab('Orders', '/apps/order/orders')
      }
   }, [history, tabs])

   if (loading)
      return (
         <div>
            <InlineLoader />
         </div>
      )
   if (error) return <div>{error.message}</div>
   return (
      <div>
         <h1>Orders</h1>
         {orders.length > 0 ? (
            orders.map(order => <OrderListItem order={order} key={order.id} />)
         ) : (
            <div>{t(address.concat('no orders yet!'))}</div>
         )}
      </div>
   )
}

export default Orders
