import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../../styled'
import { PLANNED } from '../../../../graphql'
import { NewTabIcon } from '../../../../assets/icons'
import { useTabs, useOrder } from '../../../../context'
import { InlineLoader, Flex } from '../../../../../../shared/components'
import { Products, ProductTitle, OptionsHeader, Product } from '../styled'
import {
   List,
   ListBody,
   StyledTab,
   StyledTabs,
   StyledButton,
   ListBodyItem,
   StyledTabList,
   StyledTabPanel,
   StyledTabPanels,
} from './styled'

export const MealKitSachetSection = ({ setMealKitSachetTotal }) => {
   const { state } = useOrder()
   const { loading, data: { ingredients = {} } = {} } = useSubscription(
      PLANNED.MEAL_KIT_SACHETS,
      {
         variables: {
            order: state.orders.where,
         },
         onSubscriptionData: ({
            subscriptionData: { data: { ingredients = {} } = {} } = {},
         }) => {
            setMealKitSachetTotal(ingredients.aggregate.count)
         },
      }
   )

   if (loading) return <InlineLoader />

   if (ingredients.nodes.length === 0)
      return (
         <Products>
            <span>No ingredients</span>
         </Products>
      )

   return (
      <Products>
         {ingredients.nodes.map(ingredient => (
            <Product key={ingredient.id}>
               <Flex container alignItems="center">
                  <ProductTitle title={ingredient.name}>
                     {ingredient.name}
                  </ProductTitle>
                  <h3>
                     <label>Total: </label>
                     {ingredient.processings.nodes
                        .map(processing =>
                           processing.sachets.nodes.reduce(
                              (a, b) =>
                                 b.completedOrderSachets.aggregate.count + a,
                              0
                           )
                        )
                        .reduce((a, b) => b + a, 0)}
                     /
                     {ingredient.processings.nodes
                        .map(processing =>
                           processing.sachets.nodes.reduce(
                              (a, b) => b.allOrderSachets.aggregate.count + a,
                              0
                           )
                        )
                        .reduce((a, b) => b + a, 0)}
                  </h3>
                  <h3>
                     <label>Quantity: </label>
                     {ingredient.processings.nodes
                        .map(processing =>
                           processing.sachets.nodes.reduce(
                              (a, b) =>
                                 b.completedOrderSachets.aggregate.sum
                                    .quantity + a,
                              0
                           )
                        )
                        .reduce((a, b) => b + a, 0)}
                     /
                     {ingredient.processings.nodes
                        .map(processing =>
                           processing.sachets.nodes.reduce(
                              (a, b) =>
                                 b.allOrderSachets.aggregate.sum.quantity + a,
                              0
                           )
                        )
                        .reduce((a, b) => b + a, 0)}
                  </h3>
               </Flex>
               <Spacer size="12px" />
               <OptionsHeader>
                  <span>
                     Processings({ingredient.processings.aggregate.count})
                  </span>
                  <span>Sachets</span>
               </OptionsHeader>
               {ingredient.processings.nodes.length > 0 ? (
                  <StyledTabs>
                     <StyledTabList>
                        {ingredient.processings.nodes.map(processing => (
                           <StyledTab key={processing.id}>
                              <span>
                                 {processing.name} (
                                 {processing.sachets.nodes.reduce(
                                    (a, b) =>
                                       b.completedOrderSachets.aggregate.sum
                                          .quantity + a,
                                    0
                                 )}
                                 /
                                 {processing.sachets.nodes.reduce(
                                    (a, b) =>
                                       b.allOrderSachets.aggregate.sum
                                          .quantity + a,
                                    0
                                 )}
                                 )
                              </span>{' '}
                              <span title="Total">
                                 ({processing.sachets.aggregate.count})
                              </span>
                           </StyledTab>
                        ))}
                     </StyledTabList>
                     <StyledTabPanels>
                        {ingredient.processings.nodes.map(processing => (
                           <Processing
                              key={processing.id}
                              processing={processing}
                           />
                        ))}
                     </StyledTabPanels>
                  </StyledTabs>
               ) : (
                  <span>No processings</span>
               )}
            </Product>
         ))}
      </Products>
   )
}

const Processing = ({ processing }) => {
   if (processing.sachets.nodes.length === 0) return <span>No sachets</span>
   return (
      <StyledTabPanel>
         <StyledTabs>
            <StyledTabList>
               {processing.sachets.nodes.map(sachet => (
                  <StyledTab key={sachet.id}>
                     <section>
                        <span>
                           {sachet.quantity}
                           {sachet.unit}
                        </span>
                        &nbsp;
                        <span>
                           (
                           <span title="Required">
                              {sachet.completedOrderSachets.aggregate.sum
                                 .quantity || 0}
                           </span>
                           /
                           <span title="Total">
                              {sachet.allOrderSachets.aggregate.sum.quantity}
                           </span>
                           ){sachet.unit}
                        </span>
                     </section>
                     <span title="Total">
                        ({sachet.completedOrderSachets.aggregate.count}
                        &nbsp;/&nbsp;{sachet.allOrderSachets.aggregate.count})
                     </span>
                  </StyledTab>
               ))}
            </StyledTabList>
            <StyledTabPanels>
               {processing.sachets.nodes.map(sachet => (
                  <Sachet sachet={sachet} key={sachet.id} />
               ))}
            </StyledTabPanels>
         </StyledTabs>
      </StyledTabPanel>
   )
}

const Sachet = ({ sachet }) => {
   const { addTab } = useTabs()
   const { state, selectMealKit } = useOrder()

   const openOrder = (e, id) => {
      e.stopPropagation()
      addTab(`ORD${id}`, `/apps/order/orders/${id}`)
   }

   const selectSachet = (id, name) => {
      selectMealKit(id, name)
   }

   return (
      <StyledTabPanel>
         <List>
            <ListBody>
               {sachet.allOrderSachets.nodes.map(sachet => (
                  <ListBodyItem
                     key={sachet.id}
                     isAssembled={sachet.isAssembled}
                     isActive={sachet.id === state.mealkit.sachet_id}
                     onClick={() =>
                        selectSachet(
                           sachet.id,
                           sachet.orderMealKitProduct.simpleRecipeProduct.name
                        )
                     }
                  >
                     <span>
                        <StyledButton
                           type="button"
                           onClick={e =>
                              openOrder(e, sachet.orderMealKitProduct.orderId)
                           }
                        >
                           ORD{sachet.orderMealKitProduct.orderId}
                           <NewTabIcon size={14} />
                        </StyledButton>
                     </span>
                     <span>
                        {sachet.orderMealKitProduct.simpleRecipeProduct.name}
                     </span>
                  </ListBodyItem>
               ))}
            </ListBody>
         </List>
      </StyledTabPanel>
   )
}
