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

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      toggleSidebar(visible => !visible)
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => addTab('Suppliers', 'suppliers')}>
               {t(address.concat('suppliers'))}
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Items', 'items')}>
               {t(address.concat('supplier items'))}
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
