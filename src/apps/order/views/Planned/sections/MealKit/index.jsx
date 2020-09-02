import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { PLANNED } from '../../../../graphql'
import { useOrder } from '../../../../context'
import { InlineLoader } from '../../../../../../shared/components'
import {
   Product,
   Products,
   ProductTitle,
   OptionsHeader,
   ProductOptions,
   ProductOption,
} from '../styled'

export const MealKitSection = ({ setMealKitTotal }) => {
   const { state } = useOrder()
   const {
      loading,
      data: { simpleRecipeProducts = {} } = {},
   } = useSubscription(PLANNED.MEAL_KIT_PRODUCTS, {
      variables: {
         order: state.orders.where,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { simpleRecipeProducts = {} } = {} } = {},
      }) => {
         setMealKitTotal(simpleRecipeProducts.aggregate.count)
      },
   })

   if (loading) return <InlineLoader />

   if (simpleRecipeProducts.nodes.length === 0)
      return (
         <Products>
            <span>No Meal kits</span>
         </Products>
      )

   return (
      <Products>
         {simpleRecipeProducts.nodes.map(product => (
            <Product key={product.id}>
               <ProductTitle>{product.name}</ProductTitle>
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
