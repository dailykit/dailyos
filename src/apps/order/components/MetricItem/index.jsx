import React from 'react'

import { ListItem } from './styled'
import { useOrder } from '../../context'

export const MetricItem = ({
   title,
   count,
   variant,
   amount,
   currency,
   average,
}) => {
   const { state, dispatch } = useOrder()

   const changeStatus = () => {
      dispatch({ type: 'SET_ORDERS_STATUS', payload: true })
      dispatch({
         type: 'SET_FILTER',
         payload: {
            orderStatus: { _eq: title.split(' ').join('_') },
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
   }
   return (
      <ListItem
         variant={variant}
         onClick={() => changeStatus()}
         className={
            title.split(' ').join('_') === state.orders.where?.orderStatus?._eq
               ? 'active'
               : ''
         }
      >
         <header>
            <h2>{title}</h2>
            <span title="Average">
               {currency === 'usd' && '$'}
               {average.toFixed(2)}
            </span>
         </header>
         <main>
            <span>{count}</span>
            <span title="Total">
               {currency === 'usd' && '$'}
               {amount.toFixed(2)}
            </span>
         </main>
      </ListItem>
   )
}
