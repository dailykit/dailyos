import React from 'react'

// State
import { useTabs } from '../../context/tabs'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'
import { useTranslation } from 'react-i18next'

const address = 'apps.order.sections.sidebar.'
const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   return (
      <StyledSidebar visible={visible} onClick={() => toggleSidebar(false)}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem onClick={() => addTab('Orders', '/order/orders')}>
               {t(address.concat('orders'))}
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
