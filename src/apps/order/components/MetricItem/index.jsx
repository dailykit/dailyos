import React from 'react'

import { ListItem } from './styled'

export const MetricItem = ({ title, count, variant, amount, currency }) => {
   return (
      <ListItem variant={variant}>
         <header>{title}</header>
         <main>
            <span>{count}</span>
            <span>
               {currency}
               {amount}
            </span>
         </main>
      </ListItem>
   )
}
