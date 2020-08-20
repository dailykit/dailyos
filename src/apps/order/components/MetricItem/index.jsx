import React from 'react'

import { ListItem } from './styled'

export const MetricItem = ({
   title,
   count,
   variant,
   amount,
   currency,
   average,
}) => {
   return (
      <ListItem variant={variant}>
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
