import React from 'react'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

import { useTabs } from '../../context'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { addTab, switchTab } = useTabs()

   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>Listings</StyledHeading>
         <StyledList onClick={() => toggleSidebar(visible => !visible)}>
            <StyledListItem onClick={() => switchTab('/content')}>
               Home
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('Information Blocks', '/content/blocks')}
            >
               Information Blocks
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
