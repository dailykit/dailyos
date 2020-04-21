import React from 'react'

import { DashboardTile } from '@dailykit/ui'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledTileContainer } from './styled'

const Home = () => {
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledHome>
         <h1>Inventory App</h1>
         <StyledTileContainer>
            <DashboardTile
               title="Suppliers"
               count="29"
               conf="All available"
               onClick={() => addTab('Suppliers', 'suppliers')}
            />
            <DashboardTile
               title="Items"
               count="29"
               conf="All available"
               onClick={() => addTab('Supplier Items', 'items')}
            />
         </StyledTileContainer>
      </StyledHome>
   )
}

export default Home
