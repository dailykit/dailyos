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
   const { addTab, switchTab } = useTabs()

   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList onClick={() => toggleSidebar(visible => !visible)}>
            <StyledListItem onClick={() => switchTab('/brands')}>
               Home
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
