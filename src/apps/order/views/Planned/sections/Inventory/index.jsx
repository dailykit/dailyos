import React from 'react'
import { toast } from 'react-toastify'
import { Text, Flex, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

// import { NewTabIcon } from '../../../../assets/icons'
import { QUERIES } from '../../../../graphql/queries'
import { useOrder, useTabs } from '../../../../context'
import { logger } from '../../../../../../shared/utils'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../../shared/components'
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
   const {
      error,
      loading,
      data: { inventoryProducts = {} } = {},
   } = useSubscription(QUERIES.PLANNED.PRODUCTS.INVENTORY.LIST, {
      variables: {
         order: state.orders.where,
      },
      onSubscriptionData: ({
         subscriptionData: {
            data: { inventoryProducts: products = {} } = {},
         } = {},
      }) => {
         setInventoryTotal(products.aggregate.count)
      },
   })

   // const openProduct = (id, name) => {
   //    addTab(name, `/apps/order/planned/inventory/${id}`)
   // }

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch inventory items!')
      return <ErrorState message="Failed to fetch inventory items!" />
   }
   if (inventoryProducts.nodes.length === 0)
      return <Text as="h3">No Inventories</Text>

   return (
      <>
         <Flex container alignItems="center">
            <Text as="h2">Inventory Items</Text>
            <Tooltip identifier="app_order_planned_inventory_heading" />
         </Flex>
         <Spacer size="16px" />
         <Products>
            {inventoryProducts.nodes.map(product => (
               <Product key={product.id}>
                  <Flex container alignItems="center">
                     <ProductTitle
                        // isLink
                        tabIndex="-1"
                        role="button"
                        title={product.name}
                        // onClick={() => openProduct(product.id, product.name)}
                        // onKeyPress={e =>
                        //    e.charCode === 13 &&
                        //    openProduct(product.id, product.name)
                        // }
                     >
                        {/* <NewTabIcon size={16} color="#b9b9b9" />
                        &nbsp; */}
                        {product.name}
                     </ProductTitle>
                     <h3 title={product.products.aggregate.count}>
                        <span>Total:</span> {product.products.aggregate.count}
                     </h3>
                     <h3 title={product.products.aggregate.sum.quantity}>
                        <span>Quantity:</span>{' '}
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
                              <span
                                 title={option.products.aggregate.sum.quantity}
                              >
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
      </>
   )
}
