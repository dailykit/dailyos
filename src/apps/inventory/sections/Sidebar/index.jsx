import React from 'react'
import { useTranslation } from 'react-i18next'

import { Context } from '../../context/tabs'
import {
   StyledHeading,
   StyledList,
   StyledListItem,
   StyledSidebar,
} from './styled'

const address = 'apps.inventory.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      toggleSidebar(visible => !visible)
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            {state.current.view && (
               <StyledListItem onClick={() => addTab('Home', 'home')}>
                  Home
               </StyledListItem>
            )}
            <StyledListItem onClick={() => addTab('Suppliers', 'suppliers')}>
               {t(address.concat('suppliers'))}
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Supplier Items', 'items')}>
               {t(address.concat('supplier items'))}
            </StyledListItem>
            <StyledListItem onClick={() => addTab('Work Orders', 'orders')}>
               Work Orders
            </StyledListItem>
            <StyledListItem
               onClick={() => addTab('Purchase Orders', 'purchaseOrders')}
            >
               Purchase Orders
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
