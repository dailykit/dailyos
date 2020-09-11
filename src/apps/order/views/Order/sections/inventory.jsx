import React from 'react'

import { useOrder } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import { Flex } from '../../../../../shared/components'
import {
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

export const Inventories = ({ inventories }) => {
   const { switchView, selectInventory } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const selectProduct = id => {
      setCurrent(id)
      const product = inventories.find(mealkit => id === mealkit.id)
      if ('id' in product) {
         selectInventory(product.id)
      } else {
         switchView('SUMMARY')
      }
   }

   React.useEffect(() => {
      if (inventories.length > 0) {
         const [product] = inventories
         setCurrent(product.id)
      }
   }, [inventories])

   if (inventories.length === 0) return <div>No inventories products!</div>
   return (
      <OrderItems>
         {inventories.map(inventory => (
            <OrderItem
               key={inventory.id}
               isActive={current === inventory.id}
               onClick={() => selectProduct(inventory.id)}
            >
               <Flex
                  container
                  alignitems="center"
                  justifyContent="space-between"
               >
                  <StyledProductTitle>
                     {inventory?.inventoryProduct?.name}
                     {inventory?.comboProduct?.name}
                     &nbsp;
                     {inventory?.comboProductComponent?.label &&
                        `(${inventory?.comboProductComponent?.label})`}
                  </StyledProductTitle>
                  <span>Quantity: {inventory.quantity}</span>
               </Flex>
               <section>
                  <span>
                     {inventory.isAssembled ? 1 : 0} /{' '}
                     {inventory.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
                  </span>
                  <StyledServings>
                     <span>
                        <UserIcon size={16} color="#555B6E" />
                     </span>
                     <span>
                        {inventory?.inventoryProductOption?.quantity}
                        &nbsp;-&nbsp;
                        {inventory?.inventoryProductOption?.label}
                     </span>
                  </StyledServings>
               </section>
            </OrderItem>
         ))}
      </OrderItems>
   )
}
