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

const address = 'apps.online_store.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (type, title, view) => {
      toggleSidebar(visible => !visible)
      dispatch({ type: 'ADD_TAB', payload: { type, title, view } })
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem
               onClick={() => addTab('listings', 'Products', 'products')}
            >
               {t(address.concat('products'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('listings', 'Collections', 'collections')}
            >
               {t(address.concat('collections'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('forms', 'Store Settings', 'settings')}
            >
               {t(address.concat('store settings'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('forms', 'Recurrences', 'recurrences')}
            >
               Recurrences
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
