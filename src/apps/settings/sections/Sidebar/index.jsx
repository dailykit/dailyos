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
   return (
      <StyledSidebar visible={visible} onClick={() => toggleSidebar(false)}>
         <StyledHeading>Listings</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => addTab('Users', '/settings/users')}>
               Users
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('Devices', '/settings/devices')}
            >
               Devices
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Roles', '/settings/roles')}>
               Roles
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Apps', '/settings/apps')}>
               Apps
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('Stations', '/settings/stations')}
            >
               Station
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
