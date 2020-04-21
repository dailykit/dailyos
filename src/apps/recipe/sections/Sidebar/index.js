import React from 'react'

// State
import { Context } from '../../store/tabs'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      toggleSidebar(visible => !visible)
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>Listings</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => addTab('Recipes', 'recipes')}>
               Recipes
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Ingredients', 'ingredients')}>
               Ingredients
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar