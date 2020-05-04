import React from 'react'
import { DashboardTile } from '@dailykit/ui'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList } from './styled'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledHome>
         <h1>{t(address.concat('recipe app'))}</h1>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat("recipes"))}
               count="29"
               conf="All available"
               onClick={() => addTab('Recipes', 'recipes')}
            />
            <DashboardTile
               title={t(address.concat("ingredients"))}
               count="29"
               conf="All available"
               onClick={() => addTab('Ingredients', 'ingredients')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
