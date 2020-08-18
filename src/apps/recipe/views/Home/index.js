import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

import { INGREDIENTS_COUNT, RECIPES_COUNT } from '../../graphql'

const address = 'apps.recipe.views.home.'

const Home = () => {
   const { addTab } = useTabs()
   const { t } = useTranslation()

   const { data: ingredientsData } = useSubscription(INGREDIENTS_COUNT)
   const { data: recipeData } = useSubscription(RECIPES_COUNT)

   return (
      <StyledHome>
         <h1>{t(address.concat('recipe app'))}</h1>
         <StyledCardList>
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
