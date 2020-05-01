import React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import { Tabs } from '../../components'

// Styled
import { StyledHeader, StyledMenu, StyledNav } from './styled'

// Icons
import { MenuIcon, LeftIcon, RightIcon } from '../../../../shared/assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.sections.header.'

const Header = ({ toggleSidebar }) => {
   const { t } = useTranslation()
   const history = useHistory()
   return (
      <StyledHeader>
         <StyledMenu
            title={t(address.concat("menu"))}
            tabIndex="0"
            role="button"
            onClick={() => toggleSidebar(visible => !visible)}
            onKeyPress={e =>
               e.charCode === 32 && toggleSidebar(visible => !visible)
            }
         >
            <MenuIcon color="#000" size="24" />
         </StyledMenu>
         <StyledNav>
            <button
               type="button"
               title={t(address.concat("go back"))}
               onClick={() => history.goBack()}
            >
               <LeftIcon color="#000" size="22" />
            </button>
            <button
               type="button"
               title={t(address.concat("go forward"))}
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
