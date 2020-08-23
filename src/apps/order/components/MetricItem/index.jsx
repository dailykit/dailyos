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
   const { dispatch } = useOrder()
   return (
      <ListItem
         variant={variant}
         onClick={() =>
            dispatch({
               type: 'SET_FILTER',
               payload: {
                  orderStatus: { _eq: title.split(' ').join('_') },
               },
            })
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
