import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import Loader from '../Loader'
import { useOrder } from '../../context/order'
import { FETCH_INVENTORY, UPDATE_INVENTORY_PRODUCT } from '../../graphql'
import {
   Wrapper,
   StyledStat,
   StyledMode,
   StyledHeader,
   StyledButton,
} from './styled'

export const ProcessInventory = () => {
   const {
      state: { current_view, inventory },
      switchView,
   } = useOrder()
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT)

   const {
      loading,
      error,
      data: { orderInventoryProduct: product = {} } = {},
   } = useSubscription(FETCH_INVENTORY, {
      variables: {
         id: inventory.id,
      },
   })

   if (!inventory.id) {
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
   if (loading)
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
            <h3>{product?.inventoryProduct?.name}</h3>
         </StyledHeader>
         <main>
            <StyledStat status={product.assemblyStatus}>
               <span>Assembly</span>
               <span>{product.assemblyStatus}</span>
            </StyledStat>
            <StyledButton
               type="button"
               disabled={product.assemblyStatus === 'COMPLETED'}
               onClick={() =>
                  updateProduct({
                     variables: {
                        id: inventory.id,
                        _set: { assemblyStatus: 'COMPLETED' },
                     },
                  })
               }
            >
               {product.assemblyStatus === 'COMPLETED'
                  ? 'Packed'
                  : 'Mark Packed'}
            </StyledButton>
            <StyledButton
               type="button"
               disabled={product.isAssembled}
               onClick={() =>
                  updateProduct({
                     variables: {
                        id: inventory.id,
                        _set: { isAssembled: true },
                     },
                  })
               }
            >
               {product.isAssembled ? 'Assembled' : 'Mark Assembled'}
            </StyledButton>
         </main>
      </Wrapper>
   )
}
