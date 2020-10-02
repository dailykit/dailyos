import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTabs } from '../../context'

import {
   StyledHeading,
   StyledList,
   StyledListItem,
   StyledSidebar,
} from './styled'

const address = 'apps.inventory.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const openTab = (title, route) => {
      toggleSidebar(visible => !visible)
      addTab(title, route)
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => openTab('Home', '/inventory')}>
               Home
            </StyledListItem>
            <StyledListItem
               onClick={() => openTab('Suppliers', '/inventory/suppliers')}
            >
               {t(address.concat('suppliers'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => openTab('Supplier Items', '/inventory/items')}
            >
               {t(address.concat('supplier items'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => openTab('Work Orders', '/inventory/work-orders')}
            >
               Work Orders
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  openTab('Purchase Orders', '/inventory/purchase-orders')
               }
            >
               Purchase Orders
            </StyledListItem>
            <StyledListItem
               onClick={() => openTab('Packagings', '/inventory/packagings')}
            >
               Packagings
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
