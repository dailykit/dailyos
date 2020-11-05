import React from 'react'
import { toast } from 'react-toastify'
import { Text, Flex, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { PLANNED } from '../../../../graphql'
import { useOrder } from '../../../../context'
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

export const MealKitSection = ({ setMealKitTotal }) => {
   const { state } = useOrder()
   const {
      error,
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
   if (error) {
      logger(error)
      toast.error('Failed to fetch mealkit items!')
      return <ErrorState message="Failed to fetch mealkit items!" />
   }
   if (simpleRecipeProducts.nodes.length === 0)
      return <Text as="h3">No Meal kits</Text>

   return (
      <>
         <Flex container alignItems="center">
            <Text as="h2">Meal Kit Items</Text>
            <Tooltip identifier="app_order_planned_mealkit_heading" />
         </Flex>
         <Spacer size="16px" />
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
                        <span>No servings</span>
                     )}
                  </ProductOptions>
               </Product>
            ))}
         </Products>
      </>
   )
}
