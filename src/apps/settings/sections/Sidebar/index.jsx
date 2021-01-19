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

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   return (
      <StyledSidebar visible={visible} onClick={() => toggleSidebar(false)}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => addTab('Users', '/settings/users')}>
               {t(address.concat('users'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('Devices', '/settings/devices')}
            >
               {t(address.concat('devices'))}
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Roles', '/settings/roles')}>
               {t(address.concat('roles'))}
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Apps', '/settings/apps')}>
               {t(address.concat('apps'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('Stations', '/settings/stations')}
            >
               {t(address.concat('station'))}
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Notifications', '/settings/notifications')}>
            Notifications
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
