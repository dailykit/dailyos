import React from 'react'
import { DashboardTile } from '@dailykit/ui'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList } from './styled'

const Home = () => {
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }

   return (
      <StyledHome>
         <h1>CRM</h1>
         <StyledCardList>
            <DashboardTile
               title="Customers"
               count={10000}
               conf="All available"
               onClick={() => addTab('Customers', 'customer')}
            />
            <DashboardTile
               title="Referral Plans"
               count={22}
               conf="All available"
               onClick={() => addTab('Referral Plans', 'referral-plan')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
