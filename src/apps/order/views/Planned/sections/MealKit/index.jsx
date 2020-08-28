import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { PLANNED } from '../../../../graphql'
import { useOrder, useTabs } from '../../../../context'
import { InlineLoader, Flex } from '../../../../../../shared/components'
import {
   SimpleRecipeProducts,
   SimpleRecipeProduct,
   ProductOptions,
   ProductOption,
} from './styled'

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
   return (
      <SimpleRecipeProducts>
         {simpleRecipeProducts.nodes.map(product => (
            <SimpleRecipeProduct key={product.id}>
               <h2>{product.name}</h2>
               <section className="optionsHeader">
                  <span>Yield</span>
                  <span>Total</span>
                  <span>Quantity</span>
               </section>
               <ProductOptions>
                  {product.options.map(option => (
                     <ProductOption key={option.id}>
                        <span title={option.yield.size}>
                           {option.yield.size} Serving
                        </span>
                        <span title={option.products.aggregate.count}>
                           {option.products.aggregate.count}
                        </span>
                        <span title={option.products.aggregate.sum.quantity}>
                           {option.products.aggregate.sum.quantity}
                        </span>
                     </ProductOption>
                  ))}
               </ProductOptions>
            </SimpleRecipeProduct>
         ))}
      </SimpleRecipeProducts>
   )
}
