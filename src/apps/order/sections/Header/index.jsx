import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Components
import { Tabs } from '../../components'

// Styled
import { StyledHeader, StyledMenu, StyledNav } from './styled'

// Icons
import {
   LeftIcon,
   RightIcon,
   HomeIcon,
   LeftPanelIcon,
   RightPanelIcon,
} from '../../assets/icons'

const address = 'apps.order.sections.header.'
const Header = ({ setPosition }) => {
   const { t } = useTranslation()
   const history = useHistory()
   return (
      <StyledHeader>
         <StyledMenu
            title={t(address.concat('menu'))}
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
               title={t(address.concat('go back'))}
               onClick={() => history.goBack()}
            >
               <LeftIcon color="#000" size="22" />
            </button>
            <button
               type="button"
               title={t(address.concat('go forward'))}
               onClick={() => history.goForward()}
            >
               <RightIcon color="#000" size="22" />
            </button>
         </StyledNav>
         <Tabs />
         <StyledNav align="right">
            <button
               type="button"
               title="Panel on Left"
               onClick={() => setPosition('left')}
            >
               <LeftPanelIcon color="#000" size="20" />
            </button>
            <button
               type="button"
               title="Panel on Right"
               onClick={() => setPosition('right')}
            >
               <RightPanelIcon color="#000" size="20" />
            </button>
         </StyledNav>
      </StyledHeader>
   )
}

export default Header
