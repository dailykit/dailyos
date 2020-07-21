import React from 'react'
import { useTranslation } from 'react-i18next'

// State
import { useTabs } from '../../context'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

const address = 'apps.online_store.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const addTabHandler = (title, path) => {
      toggleSidebar(visible => !visible)
      addTab(title, path)
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem
               onClick={() =>
                  addTabHandler('Products', '/online-store/products')
               }
            >
               {t(address.concat('products'))}
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler('Collections', '/online-store/collections')
               }
            >
               {t(address.concat('collections'))}
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler('Store Settings', '/online-store/settings')
               }
            >
               {t(address.concat('store settings'))}
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
