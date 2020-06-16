import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

// Components
import { Tabs } from '../../components'

// Styled
import { StyledHeader, StyledMenu, StyledNav } from './styled'

// Icons
import {
   BellIcon,
   LeftIcon,
   RightIcon,
   HomeIcon,
   LeftPanelIcon,
   RightPanelIcon,
} from '../../assets/icons'
import { NEW_NOTIF } from '../../graphql'

const address = 'apps.order.sections.header.'

const Header = ({ setPosition, isOpen, openPortal, closePortal }) => {
   const history = useHistory()
   const { t } = useTranslation()
   const {
      loading,
      data: { displayNotifications: notifications = [] } = {},
   } = useSubscription(NEW_NOTIF)

   React.useEffect(() => {
      if (!loading && notifications.length > 0) {
         const audio = new Audio(notifications[0]?.type?.audioUrl)
         audio.play()
      }
   }, [loading, notifications])

   return (
      <StyledHeader>
         <StyledMenu
            title={t(address.concat('menu'))}
            tabIndex="0"
            role="button"
            onClick={() => history.push('/apps/order')}
            onKeyPress={e => e.charCode === 32 && history.push('/apps/order')}
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
               title="Notifications"
               onClick={e => (isOpen ? closePortal(e) : openPortal(e))}
            >
               <BellIcon color="#000" size="20" />
            </button>
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
