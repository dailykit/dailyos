import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../../styled'
import { useOrder, useTabs } from '../../../../context'
import { NewTabIcon } from '../../../../assets/icons'
import { PLANNED } from '../../../../graphql/queries'
import { InlineLoader, Flex } from '../../../../../../shared/components'
import {
   InventoryProducts,
   InventoryProduct,
   ProductOptions,
   ProductOption,
} from './styled'

export const InventorySection = ({ setInventoryTotal }) => {
   const { state } = useOrder()
   const { addTab } = useTabs()
   const { loading, data: { inventoryProducts = {} } = {} } = useSubscription(
      PLANNED.INVENTORY_PRODUCTS,
      {
         variables: {
            order: state.orders.where,
         },
         onSubscriptionData: ({
            subscriptionData: { data: { inventoryProducts = {} } = {} } = {},
         }) => {
            setInventoryTotal(inventoryProducts.aggregate.count)
         },
      }
   )

   const openProduct = (id, name) => {
      addTab(name, `/apps/order/planned/inventory/${id}`)
   }

   if (loading) return <InlineLoader />
   return (
      <InventoryProducts>
         {inventoryProducts.nodes.map(product => (
            <InventoryProduct key={product.id}>
               <Flex container alignItems="center">
                  <h2
                     title={product.name}
                     tabIndex="-1"
                     role="button"
                     onClick={() => openProduct(product.id, product.name)}
                     onKeyPress={e =>
                        e.charCode === 13 &&
                        openProduct(product.id, product.name)
                     }
                  >
                     <NewTabIcon size={16} color="#b9b9b9" />
                     &nbsp;
                     {product.name}
                  </h2>
                  <h3 title={product.products.aggregate.count}>
                     <label>Total:</label> {product.products.aggregate.count}
                  </h3>
                  <h3 title={product.products.aggregate.sum.quantity}>
                     <label>Quantity:</label>{' '}
                     {product.products.aggregate.sum.quantity}
                  </h3>
               </Flex>
               <Spacer size="16px" />
               <section className="optionsHeader">
                  <span>Label</span>
                  <span>Quantity</span>
               </section>
               <ProductOptions>
                  {product.options.map(option => (
                     <ProductOption key={option.id}>
                        <span title={option.label}>{option.label}</span>
                        <span title={option.products.aggregate.sum.quantity}>
                           {option.products.aggregate.sum.quantity}
                        </span>
                     </ProductOption>
                  ))}
               </ProductOptions>
            </InventoryProduct>
         ))}
      </InventoryProducts>
   )
}
