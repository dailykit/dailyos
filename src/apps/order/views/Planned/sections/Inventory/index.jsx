import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../../styled'
import { useOrder, useTabs } from '../../../../context'
import { NewTabIcon } from '../../../../assets/icons'
import { PLANNED } from '../../../../graphql/queries'
import { InlineLoader, Flex } from '../../../../../../shared/components'
import {
   Product,
   Products,
   ProductTitle,
   OptionsHeader,
   ProductOptions,
   ProductOption,
} from '../styled'

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

   if (inventoryProducts.nodes.length === 0)
      return (
         <Products>
            <span>No Inventories</span>
         </Products>
      )

   return (
      <Products>
         {inventoryProducts.nodes.map(product => (
            <Product key={product.id}>
               <Flex container alignItems="center">
                  <ProductTitle
                     isLink
                     tabIndex="-1"
                     role="button"
                     title={product.name}
                     onClick={() => openProduct(product.id, product.name)}
                     onKeyPress={e =>
                        e.charCode === 13 &&
                        openProduct(product.id, product.name)
                     }
                  >
                     <NewTabIcon size={16} color="#b9b9b9" />
                     &nbsp;
                     {product.name}
                  </ProductTitle>
                  <h3 title={product.products.aggregate.count}>
                     <label>Total:</label> {product.products.aggregate.count}
                  </h3>
                  <h3 title={product.products.aggregate.sum.quantity}>
                     <label>Quantity:</label>{' '}
                     {product.products.aggregate.sum.quantity}
                  </h3>
               </Flex>
               <Spacer size="16px" />
               <OptionsHeader>
                  <span>Label</span>
                  <span>Total</span>
                  <span>Quantity</span>
               </OptionsHeader>
               <ProductOptions>
                  {product.options.length > 0 ? (
                     product.options.map(option => (
                        <ProductOption
                           key={option.id}
                           isAssembled={
                              option.assembledProducts.aggregate.count ===
                              option.products.aggregate.count
                           }
                        >
                           <span title={option.label}>{option.label}</span>
                           <span title={option.products.aggregate.count}>
                              {option.assembledProducts.aggregate.count}
                              &nbsp;/&nbsp;{option.products.aggregate.count}
                           </span>
                           <span title={option.products.aggregate.sum.quantity}>
                              {option.assembledProducts.aggregate.sum
                                 .quantity || 0}
                              &nbsp;/&nbsp;
                              {option.products.aggregate.sum.quantity}
                           </span>
                        </ProductOption>
                     ))
                  ) : (
                     <span>No product options</span>
                  )}
               </ProductOptions>
            </Product>
         ))}
      </Products>
   )
}
