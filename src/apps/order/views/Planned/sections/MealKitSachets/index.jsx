import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../../styled'
import { PLANNED } from '../../../../graphql'
import { useTabs, useOrder } from '../../../../context'
import { InlineLoader, Flex } from '../../../../../../shared/components'
import {
   List,
   ListBody,
   StyledTab,
   StyledTabs,
   Ingredient,
   Ingredients,
   StyledButton,
   ListBodyItem,
   StyledTabList,
   StyledTabPanel,
   StyledTabPanels,
} from './styled'
import { NewTabIcon } from '../../../../assets/icons'

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
         <Ingredients>
            <span>No ingredients</span>
         </Ingredients>
      )

   return (
      <Ingredients>
         {ingredients.nodes.map(ingredient => (
            <Ingredient key={ingredient.id}>
               <Flex container alignItems="center">
                  <h2 title={ingredient.name}>{ingredient.name}</h2>
               </Flex>
               <Spacer size="12px" />
               <section className="optionsHeader">
                  <span>
                     Processings({ingredient.processings.aggregate.count})
                  </span>
                  <span>Sachets</span>
               </section>
               {ingredient.processings.nodes.length > 0 ? (
                  <StyledTabs>
                     <StyledTabList>
                        {ingredient.processings.nodes.map(processing => (
                           <StyledTab key={processing.id}>
                              {processing.name}
                           </StyledTab>
                        ))}
                     </StyledTabList>
                     <StyledTabPanels>
                        {ingredient.processings.nodes.map(processing => (
                           <Processing processing={processing} />
                        ))}
                     </StyledTabPanels>
                  </StyledTabs>
               ) : (
                  <span>No processings</span>
               )}
            </Ingredient>
         ))}
      </Ingredients>
   )
}

const Processing = ({ processing }) => {
   if (processing.sachets.nodes.length === 0) return <span>No sachets</span>
   return (
      <StyledTabPanel>
         <StyledTabs>
            <StyledTabList>
               {processing.sachets.nodes.map(sachet => (
                  <StyledTab key={sachet.id}>{sachet.quantity}</StyledTab>
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
                     <span>{sachet.quantity}</span>
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
