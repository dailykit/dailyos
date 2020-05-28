import React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import { Tabs } from '../../components'

// Styled
import { StyledHeader, StyledMenu, StyledNav } from './styled'

// Icons
import { LeftIcon, RightIcon, HomeIcon } from '../../assets/icons'

const Header = () => {
   const history = useHistory()
   return (
      <StyledHeader>
         <StyledMenu
            title="Menu"
            tabIndex="0"
            role="button"
            onClick={() => history.push('/order')}
            onKeyPress={e => e.charCode === 32 && history.push('/order')}
         >
            <HomeIcon color="#000" size="20" />
         </StyledMenu>
         <StyledNav>
            <button
               type="button"
               title="Go Back"
               onClick={() => history.goBack()}
            >
               <LeftIcon color="#000" size="22" />
            </button>
            <button
               type="button"
               title="Go Foreward"
               onClick={() => history.goForward()}
            >
               <RightIcon color="#000" size="22" />
            </button>
         </StyledNav>
         <Tabs />
      </StyledHeader>
   )
}

export default Header
