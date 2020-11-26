import React from 'react'
import { toast } from 'react-toastify'
import { Flex, Text } from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import { useOrder } from '../../context/order'
import { logger } from '../../../../shared/utils'
import { MUTATIONS, QUERIES, UPDATE_READYTOEAT } from '../../graphql'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../shared/components'
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
   const [updateProduct] = useMutation(
      MUTATIONS.ORDER.PRODUCT.READYTOEAT.UPDATE
   )

   const {
      loading,
      error,
      data: { orderReadyToEatProduct: product = {} } = {},
   } = useSubscription(QUERIES.ORDER.READY_TO_EAT.ONE, {
      variables: {
         id: readytoeat.id,
      },
   })

   if (!readytoeat.id) {
      return (
         <Wrapper>
            <StyledMode>
               <Flex container alignItems="center">
                  <label htmlFor="mode">Mode</label>
                  <Tooltip identifier="left_panel_mode" />
               </Flex>
               <select
                  id="mode"
                  name="mode"
                  value={current_view}
                  onChange={e => switchView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="SACHET_ITEM">Process Sachet</option>
                  <option value="INVENTORY">Inventory</option>
                  <option value="READYTOEAT">Ready to Eat</option>
               </select>
            </StyledMode>
            <Text as="h3">No product selected!</Text>
         </Wrapper>
      )
   }
   if (loading || !product) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch ready to eat product details!')
      return (
         <Wrapper>
            <StyledMode>
               <Flex container alignItems="center">
                  <label htmlFor="mode">Mode</label>
                  <Tooltip identifier="left_panel_mode" />
               </Flex>
               <select
                  id="mode"
                  name="mode"
                  value={current_view}
                  onChange={e => switchView(e.target.value)}
               >
                  <option value="SUMMARY">Summary</option>
                  <option value="SACHET_ITEM">Process Sachet</option>
                  <option value="INVENTORY">Inventory</option>
                  <option value="READYTOEAT">Ready to Eat</option>
               </select>
            </StyledMode>
            <ErrorState message="Failed to fetch ready to eat product details!" />
         </Wrapper>
      )
   }

   return (
      <Wrapper>
         <StyledMode>
            <Flex container alignItems="center">
               <label htmlFor="mode">Mode</label>
               <Tooltip identifier="left_panel_mode" />
            </Flex>
            <select
               id="mode"
               name="mode"
               value={current_view}
               onChange={e => switchView(e.target.value)}
            >
               <option value="SUMMARY">Summary</option>
               <option value="SACHET_ITEM">Process Sachet</option>
               <option value="INVENTORY">Inventory</option>
               <option value="READYTOEAT">Ready to Eat</option>
            </select>
         </StyledMode>
         <StyledHeader>
            <h3>
               {current_view === 'INVENTORY' && product?.inventoryProduct?.name}
               {['SACHET_ITEM', 'READYTOEAT'].includes(current_view) &&
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
            <StyledButton
               type="button"
               disabled={product.assemblyStatus === 'COMPLETED'}
               onClick={() =>
                  updateProduct({
                     variables: {
                        id: readytoeat.id,
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
                        id: readytoeat.id,
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
