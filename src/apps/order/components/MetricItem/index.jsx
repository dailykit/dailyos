import React from 'react'

import { ListItem } from './styled'
import { useOrder } from '../../context'
import { currencyFmt } from '../../../../shared/utils'
import { useWindowSize } from '../../../../shared/hooks'

export const MetricItem = ({
   title,
   count = 0,
   variant,
   amount = 0,
   average = 0,
   closeOrderSummaryTunnel,
}) => {
   const { state, dispatch } = useOrder()
   const { width, height } = useWindowSize()

   const changeStatus = () => {
      const isPortrait = height > width
      dispatch({ type: 'SET_ORDERS_STATUS', payload: true })
      dispatch({
         type: 'SET_FILTER',
         payload: {
            orderStatus: {
               ...(!['ALL', 'REJECTED OR CANCELLED'].includes(title) && {
                  _eq: title.split(' ').join('_'),
               }),
            },
            ...(title === 'REJECTED OR CANCELLED'
               ? { _or: [{ isRejected: { _eq: true } }] }
               : {
                    _or: [
                       { isRejected: { _eq: false } },
                       { isRejected: { _is_null: true } },
                    ],
                 }),
            ...(title === 'ALL' && {
               _or: [
                  { isRejected: { _eq: false } },
                  { isRejected: { _eq: true } },
                  { isRejected: { _is_null: true } },
               ],
            }),
         },
      })
      dispatch({
         type: 'SET_PAGINATION',
         payload: { limit: 10, offset: 0 },
      })
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      })
      window.history.pushState(
         '',
         document.title,
         window.location.pathname + window.location.search
      )
      if (isPortrait) closeOrderSummaryTunnel(1)
   }
   return (
      <ListItem
         variant={variant}
         onClick={() => changeStatus()}
         className={
            (Object.keys(state.orders.where?.orderStatus).length === 0 &&
               title === 'ALL') ||
            title.split(' ').join('_') === state.orders.where?.orderStatus?._eq
               ? 'active'
               : ''
         }
      >
         <header>
            <h2>{title}</h2>
            <span title="Average">
               {currencyFmt(Number(average?.toFixed(2)) || 0)}
            </span>
         </header>
         <main>
            <span>{count}</span>
            <span title="Total">
               {currencyFmt(Number(amount?.toFixed(2)) || 0)}
            </span>
         </main>
      </ListItem>
   )
}
