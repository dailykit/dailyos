import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

import {
   RECIPES_COUNT,
   SRP_COUNT,
   IP_COUNT,
   COP_COUNT,
   CUP_COUNT,
   INGREDIENTS_COUNT,
} from '../../graphql'

const address = 'apps.recipe.views.home.'

const Home = () => {
   const { addTab } = useTabs()
   const { t } = useTranslation()

   const { data: ingredientsData } = useSubscription(INGREDIENTS_COUNT)
   const { data: recipeData } = useSubscription(RECIPES_COUNT)
   const { data: simpleRecipeProductData } = useSubscription(SRP_COUNT)
   const { data: inventoryProductData } = useSubscription(IP_COUNT)
   const { data: comboProductData } = useSubscription(COP_COUNT)
   const { data: customizableProductData } = useSubscription(CUP_COUNT)

   return (
      <StyledHome>
         <h1>{t(address.concat('recipe app'))}</h1>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat('products'))}
               count={
                  simpleRecipeProductData?.simpleRecipeProductsAggregate
                     .aggregate.count +
                     inventoryProductData?.inventoryProductsAggregate.aggregate
                        .count +
                     customizableProductData?.customizableProductsAggregate
                        .aggregate.count +
                     comboProductData?.comboProductsAggregate.aggregate.count ||
                  '...'
               }
               conf="All available"
               onClick={() => addTab('Products', '/recipe/products')}
            />
            <DashboardTile
               title={t(address.concat('recipes'))}
               count={
                  recipeData?.simpleRecipesAggregate.aggregate.count || '...'
               }
               conf="All available"
               onClick={() => addTab('Recipes', '/recipe/recipes')}
            />
            <DashboardTile
               title={t(address.concat('ingredients'))}
               count={
                  ingredientsData?.ingredientsAggregate.aggregate.count || '...'
               }
               conf="All available"
               onClick={() => addTab('Ingredients', '/recipe/ingredients')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
