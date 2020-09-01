import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useSubscription } from '@apollo/react-hooks'

import { paginate } from '../../utils'
import { useOrder } from '../../context'
import { useTabs } from '../../context/tabs'
import { OrderListItem } from '../../components'
import { ORDERS, ORDERS_AGGREGATE } from '../../graphql'
import { Flex, InlineLoader } from '../../../../shared/components'

const address = 'apps.order.views.orders.'
const Orders = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   const { state, dispatch } = useOrder()
   const [active, setActive] = React.useState(1)
   const [orders, setOrders] = React.useState([])
   const {
      loading: loadingAggregate,
      data: { ordersAggregate = {} } = {},
   } = useQuery(ORDERS_AGGREGATE, {
      variables: {
         where: {
            orderStatus: { _eq: state.orders.where.orderStatus._eq },
         },
      },
   })
   useSubscription(ORDERS, {
      variables: {
         where: state.orders.where,
         ...(state.orders.limit && { limit: state.orders.limit }),
         ...(state.orders.offset !== null && { offset: state.orders.offset }),
      },
      onSubscriptionData: ({
         subscriptionData: { data: { orders = [] } = {} } = {},
      }) => {
         setOrders(orders)
         if (state.orders.limit) {
            if (!loadingAggregate && ordersAggregate?.aggregate?.count > 10) {
               dispatch({
                  type: 'SET_PAGINATION',
                  payload: { limit: null, offset: null },
               })
            }
            dispatch({ type: 'SET_ORDERS_STATUS', payload: false })
         }
      },
   })

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/apps/order/orders`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         addTab('Orders', '/apps/order/orders')
      }
   }, [history, tabs])

   React.useEffect(() => {
      window.addEventListener('hashchange', () => {
         setActive(Number(window.location.hash.slice(1)))
      })
      return () =>
         window.removeEventListener('hashchange', () => {
            setActive(Number(window.location.hash.slice(1)))
         })
   }, [])

   React.useEffect(() => {
      setActive(1)
   }, [state.orders.where.orderStatus])

   return (
      <div>
         <Flex
            container
            height="48px"
            alignItems="center"
            padding="0 16px"
            justifyContent="space-between"
         >
            <h1>Orders</h1>
            <Pagination>
               {!loadingAggregate &&
                  ordersAggregate?.aggregate?.count > 10 &&
                  paginate(
                     active,
                     Math.ceil(ordersAggregate?.aggregate?.count / 10)
                  ).map((node, index) => (
                     <PaginationItem
                        key={index}
                        className={active === node ? 'active' : ''}
                     >
                        {typeof node === 'string' ? (
                           <span>{node}</span>
                        ) : (
                           <a href={`#${node}`}>{node}</a>
                        )}
                     </PaginationItem>
                  ))}
            </Pagination>
         </Flex>
         {state.orders.loading ? (
            <InlineLoader />
         ) : (
            <section style={{ overflowY: 'auto', height: 'calc(100vh - 128px' }}>
               {orders.length > 0 ? (
                  orders.map((order, index) => (
                     <OrderListItem
                        order={order}
                        key={order.id}
                        containerId={`${
                           index % 10 === 0 ? `${index / 10 + 1}` : ''
                        }`}
                     />
                  ))
               ) : (
                  <Flex padding="16px">
                     {t(address.concat('no orders yet!'))}
                  </Flex>
               )}
            </section>
         )}
      </div>
   )
}

export default Orders

const Pagination = styled.ul`
   display: flex;
   align-items: center;
   > :not(template) ~ :not(template) {
      --space-x-reverse: 0;
      margin-right: calc(12px * var(--space-x-reverse));
      margin-left: calc(12px * (1 - var(--space-x-reverse)));
   }
`

const PaginationItem = styled.li`
   list-style: none;
   a,
   span {
      width: 28px;
      height: 28px;
      color: #1a1d4b;
      align-items: center;
      display: inline-flex;
      justify-content: center;
   }
   a {
      border-radius: 2px;
      text-decoration: none;
      border: 1px solid #ffd5d5;
   }
`
