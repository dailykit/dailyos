import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../../styled'
import { QUERIES } from '../../../../graphql'
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
      QUERIES.PLANNED.PRODUCTS.MEAL_KIT.SACHET.LIST,
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
   return (
      <Ingredients>
         {ingredients.nodes.length > 0 &&
            ingredients.nodes.map(ingredient => (
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
               </Ingredient>
            ))}
      </Ingredients>
   )
}

const Processing = ({ processing }) => {
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
   const { state, selectSachet } = useOrder()

   const openOrder = (e, id) => {
      e.stopPropagation()
      addTab(`ORD${id}`, `/apps/order/orders/${id}`)
   }

   const select = (id, name) => {
      selectSachet(id, { name })
   }

   return (
      <StyledTabPanel>
         <List>
            <ListBody>
               {sachet.allOrderSachets.nodes.map(sachet => (
                  <ListBodyItem
                     key={sachet.id}
                     isAssembled={sachet.isAssembled}
                     isActive={sachet.id === state.sachet.id}
                     onClick={() =>
                        select(
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
