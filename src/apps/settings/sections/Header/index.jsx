import React from 'react'

import { Tabs } from '../../components'
import { StyledHeader, StyledMenu } from './styled'
import { MenuIcon } from '../../../../shared/assets/icons'

const Header = ({ toggleSidebar }) => {
   return (
      <StyledHeader>
         <StyledMenu
            title="Menu"
            type="button"
            onClick={() => toggleSidebar(visible => !visible)}
         >
            <MenuIcon color="#000" size="24" />
         </StyledMenu>
         <Tabs />
      </StyledHeader>
   )
}

export default Header
