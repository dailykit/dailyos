import React from 'react'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

export const Sidebar = ({ open, toggle, links }) => {
   return (
      <StyledSidebar visible={open}>
         <StyledHeading>Listings</StyledHeading>
         <StyledList onClick={() => toggle(visible => !visible)}>
            {links.map(({ id, title, onClick }) => (
               <StyledListItem key={id} onClick={onClick}>
                  {title}
               </StyledListItem>
            ))}
         </StyledList>
      </StyledSidebar>
   )
}
