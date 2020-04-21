import React from 'react'
import { DashboardTile } from '@dailykit/ui'

// State
import { Context } from '../../store/tabs'

import { StyledHome, StyledCardList } from './styled'

const Home = () => {
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledHome>
         <h1>Recipe App</h1>
         <StyledCardList>
            <DashboardTile
               title='Recipes'
               count='29'
               conf='All available'
               onClick={() => addTab('Recipes', 'recipes')}
            />
            <DashboardTile
               title='Ingredients'
               count='29'
               conf='All available'
               onClick={() => addTab('Ingredients', 'ingredients')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
