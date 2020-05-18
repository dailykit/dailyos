import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList } from './styled'

import { useTranslation, Trans } from 'react-i18next'

import { S_INGREDIENTS, S_RECIPES } from '../../graphql'

const address = 'apps.recipe.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }

   const { data: ingredientsData } = useSubscription(S_INGREDIENTS)
   const { data: recipeData } = useSubscription(S_RECIPES)

   return (
      <StyledHome>
         <h1>{t(address.concat('recipe app'))}</h1>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat('recipes'))}
               count={recipeData?.simpleRecipes.length || '...'}
               conf="All available"
               onClick={() => addTab('Recipes', 'recipes')}
            />
            <DashboardTile
               title={t(address.concat('ingredients'))}
               count={ingredientsData?.ingredients.length || '...'}
               conf="All available"
               onClick={() => addTab('Ingredients', 'ingredients')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
