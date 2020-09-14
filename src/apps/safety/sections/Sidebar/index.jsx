import React from 'react'
import { useTranslation } from 'react-i18next'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

import { useTabs } from '../../context'

const address = 'apps.safety.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { addTab: createTab } = useTabs()

   const addTab = title => {
      toggleSidebar(visible => !visible)
      createTab(title, '/apps/safety/checks')
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => addTab('Safety Checks')}>
               {t(address.concat('Safety Checks'))}
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
