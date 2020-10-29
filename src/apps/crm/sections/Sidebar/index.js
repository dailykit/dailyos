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

//Component
import { BrandListing } from '../../components'

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
               onClick={() => addTabHandler('Coupons', '/crm/coupons')}
            >
               Coupons
            </StyledListItem>
            <StyledListItem
               onClick={() => addTabHandler('Campaign', '/crm/campaign')}
            >
               Campaign
            </StyledListItem>
         </StyledList>
         <BrandListing />
      </StyledSidebar>
   )
}

export default Sidebar
