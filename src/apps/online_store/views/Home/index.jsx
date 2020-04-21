import React from 'react'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList, StyledCard } from './styled'

const Home = () => {
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledHome>
         <h1>Seller App</h1>
         <StyledCardList>
            <StyledCard onClick={() => addTab('Products', 'products')}>
               <h2>Products</h2>
               <p>10 created so far</p>
               <span data-type="status">All active</span>
               <span data-type="link">Go to Products ></span>
            </StyledCard>
            <StyledCard onClick={() => addTab('Collections', 'collections')}>
               <h2>Collections</h2>
               <p>4 created so far</p>
               <span data-type="status">All available</span>
               <span data-type="link">Go to Collections ></span>
            </StyledCard>
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
