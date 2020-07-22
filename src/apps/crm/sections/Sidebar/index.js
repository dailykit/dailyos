import React from 'react'

// State
import { useTabs } from '../../context'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { addTab } = useTabs()

   const addTabHandler = (title, path) => {
      toggleSidebar(visible => !visible)
      addTab(title, path)
   }

   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>Listings</StyledHeading>
         <StyledList>
            <StyledListItem
               onClick={() => addTabHandler('Customers', '/crm/customers')}
            >
               Customers
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler('Referral Plans', '/crm/referral-plans')
               }
            >
               Referral Plan
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
