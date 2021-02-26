import React from 'react'

import { StyledTable } from './styled'

const ProductOptionsPanel = ({ options }) => {
   return (
      <StyledTable>
         <thead>
            <tr>
               <th>Label</th>
               <th>Quantity</th>
               <th>Price</th>
               <th>Discount</th>
            </tr>
         </thead>
         {options.map(({ productOption: option }) => (
            <tr key={option.id}>
               <td>{option.label}</td>
               <td>{option.quantity}</td>
               <td>{option.price}</td>
               <td>{option.discount}</td>
            </tr>
         ))}
      </StyledTable>
   )
}

export default ProductOptionsPanel
