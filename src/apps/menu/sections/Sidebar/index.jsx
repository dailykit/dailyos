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

const address = 'apps.menu.sections.sidebar.'

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
               onClick={() => addTabHandler('Collections', '/menu/collections')}
            >
               {t(address.concat('collections'))}
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler(
                     'Pre-Order Delivery',
                     '/menu/recurrences/PREORDER_DELIVERY'
                  )
               }
            >
               Pre-Order Delivery
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler(
                     'Pre-Order Pickup',
                     '/menu/recurrences/PREORDER_PICKUP'
                  )
               }
            >
               Pre-Order Pickup
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler(
                     'On-Demand Delivery',
                     '/menu/recurrences/ONDEMAND_DELIVERY'
                  )
               }
            >
               On-Demand Delivery
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler(
                     'On-Demand Pickup',
                     '/menu/recurrences/ONDEMAND_PICKUP'
                  )
               }
            >
               On-Demand Pickup
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
