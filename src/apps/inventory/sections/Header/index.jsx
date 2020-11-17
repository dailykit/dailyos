import { Flex } from '@dailykit/ui'
import React from 'react'
// Icons
import { MenuIcon } from '../../assets/icons'
// Components
import { Tabs } from '../../components'
// Styled
import { StyledMenu } from './styled'

const Header = ({ toggleSidebar }) => {
   return (
      <Flex container style={{ background: '#d9e9f1' }}>
         <StyledMenu onClick={() => toggleSidebar(visible => !visible)}>
            <MenuIcon color="#000" size="24" />
         </StyledMenu>
         <Tabs />
      </Flex>
   )
}

export default Header
