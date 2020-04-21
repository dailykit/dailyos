import React from 'react'

// State
import { Context } from '../../context/tabs'

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
            <StyledListItem onClick={() => addTab('Suppliers', 'suppliers')}>
               Suppliers
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Items', 'items')}>
               Supplier Items
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
