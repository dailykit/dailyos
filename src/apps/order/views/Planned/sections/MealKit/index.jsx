import React from 'react'
import { toast } from 'react-toastify'
import { Text, Flex, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { QUERIES } from '../../../../graphql'
// import { NewTabIcon } from '../../../../assets/icons'
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

export const MealKitSection = ({ setMealKitTotal }) => {
   const { addTab } = useTabs()
   const { state } = useOrder()
   const {
      error,
      loading,
      data: { simpleRecipeProducts = {} } = {},
   } = useSubscription(QUERIES.PLANNED.PRODUCTS.MEAL_KIT.LIST, {
      variables: {
         order: state.orders.where,
      },
      onSubscriptionData: ({
         subscriptionData: {
            data: { simpleRecipeProducts: products = {} } = {},
         } = {},
      }) => {
         setMealKitTotal(products.aggregate.count)
      },
   })

   // const openProduct = (id, name) => {
   //    addTab(name, `/apps/order/planned/meal-kit/${id}`)
   // }

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
