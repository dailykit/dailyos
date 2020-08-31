import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { PLANNED } from '../../../../graphql'
import { useOrder, useTabs } from '../../../../context'
import { NewTabIcon } from '../../../../assets/icons'
import { InlineLoader, Flex } from '../../../../../../shared/components'
import {
   Product,
   Products,
   ProductTitle,
   OptionsHeader,
   ProductOptions,
   ProductOption,
} from '../styled'

export const ReadyToEatSection = ({ setReadyToEatTotal }) => {
   const { addTab } = useTabs()
   const { state } = useOrder()
   const {
      loading,
      data: { simpleRecipeProducts = {} } = {},
   } = useSubscription(PLANNED.READY_TO_EAT_PRODUCTS, {
      variables: {
         order: state.orders.where,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { simpleRecipeProducts = {} } = {} } = {},
      }) => {
         setReadyToEatTotal(simpleRecipeProducts.aggregate.count)
      },
   })

   const openProduct = (id, name) => {
      addTab(name, `/apps/order/planned/ready-to-eat/${id}`)
   }

   if (loading) return <InlineLoader />

   if (simpleRecipeProducts.nodes.length === 0)
      return (
         <Products>
            <span>No Ready to eats</span>
         </Products>
      )
   return (
      <Products>
         {simpleRecipeProducts.nodes.map(product => (
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
               </Flex>
               <OptionsHeader>
                  <span>Yield</span>
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
                           <span title={option.yield.size}>
                              {option.yield.size} Serving
                           </span>
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
                     <span>No servings</span>
                  )}
               </ProductOptions>
            </Product>
         ))}
      </Products>
   )
}
