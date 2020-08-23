import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import Loader from '../Loader'
import { useOrder } from '../../context/order'
import { FETCH_READYTOEAT, UPDATE_READYTOEAT } from '../../graphql'
import {
   Wrapper,
   StyledMode,
   StyledStat,
   StyledHeader,
   StyledButton,
} from './styled'

export const ProcessReadyToEat = () => {
   const {
      state: { current_view, readytoeat },
      switchView,
   } = useOrder()
   const [updateProduct] = useMutation(UPDATE_READYTOEAT)

   const {
      loading,
      error,
      data: { orderReadyToEatProduct: product = {} } = {},
   } = useSubscription(FETCH_READYTOEAT, {
      variables: {
         id: readytoeat.id,
      },
   })

   if (!readytoeat.id) {
      return (
         <Wrapper>
            <StyledMode>
               <label htmlFor="mode">Mode</label>
               <select
                  id="mode"
                  name="mode"
                  value={current_view}
                  onChange={e => switchView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="MEALKIT">Meal Kit</option>
                  <option value="INVENTORY">Inventory</option>
                  <option value="READYTOEAT">Ready to Eat</option>
               </select>
            </StyledMode>
            <span>No product selected!</span>
         </Wrapper>
      )
   }
   if (loading || !product)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error)
      return (
         <Wrapper>
            <StyledMode>
               <label htmlFor="mode">Mode</label>
               <select
                  id="mode"
                  name="mode"
                  value={current_view}
                  onChange={e => switchView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="MEALKIT">Meal Kit</option>
                  <option value="INVENTORY">Inventory</option>
                  <option value="READYTOEAT">Ready to Eat</option>
               </select>
            </StyledMode>
            <span>{error.message}</span>
         </Wrapper>
      )

   return (
      <Wrapper>
         <StyledMode>
            <label htmlFor="mode">Mode</label>
            <select
               id="mode"
               name="mode"
               value={current_view}
               onChange={e => switchView(e.target.value)}
            >
               <option value="SUMMARY">Summary</option>
               <option value="MEALKIT">Meal Kit</option>
               <option value="INVENTORY">Inventory</option>
               <option value="READYTOEAT">Ready to Eat</option>
            </select>
         </StyledMode>
         <StyledHeader>
            <h3>
               {current_view === 'INVENTORY' && product?.inventoryProduct?.name}
               {['MEALKIT', 'READYTOEAT'].includes(current_view) &&
                  product?.simpleRecipeProduct?.name}
               {product?.comboProduct?.name}
               &nbsp;
               {product?.comboProductComponent?.label &&
                  `(${product?.comboProductComponent?.label})`}
            </h3>
         </StyledHeader>
         <main>
            <StyledStat status={product.assemblyStatus}>
               <span>Assembly</span>
               <span>{product.assemblyStatus}</span>
            </StyledStat>
            {product.assemblyStatus === 'PENDING' && (
               <StyledButton
                  type="button"
                  onClick={() =>
                     updateProduct({
                        variables: {
                           id: readytoeat.id,
                           assemblyStatus: 'COMPLETED',
                        },
                     })
                  }
               >
                  Mark Done
               </StyledButton>
            )}
         </main>
      </Wrapper>
   )
}
