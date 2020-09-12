import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useTabs } from '../../context'
import { useWindowSize } from '../../../../shared/hooks'
import { StyledTabs, StyledTab, Button, Dropdown } from './styled'
import {
   CloseIcon,
   ChevronUp,
   ChevronDown,
} from '../../../../shared/assets/icons'

const address = 'apps.settings.components.tabs.'

const Tabs = () => {
   const view = useWindowSize()
   const { tabs } = useTabs()
   const [isOpen, setIsOpen] = React.useState(false)
   return (
      <>
         <StyledTabs>
            {tabs.slice(0, Math.floor(view.width / 240)).map((tab, index) => (
               <Tab
                  tab={tab}
                  key={tab.path}
                  index={index}
                  setIsOpen={setIsOpen}
               />
            ))}
         </StyledTabs>
         <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
         </Button>
         {isOpen && (
            <Dropdown>
               <ul>
                  {tabs.slice(Math.floor(view.width / 240)).length > 0 ? (
                     tabs
                        .slice(Math.floor(view.width / 240))
                        .map((tab, index) => (
                           <Tab
                              tab={tab}
                              index={index}
                              key={tab.path}
                              setIsOpen={setIsOpen}
                              className="in_dropdown"
                           />
                        ))
                  ) : (
                     <p>No tabs</p>
                  )}
               </ul>
            </Dropdown>
         )}
      </>
   )
}

export default Tabs

const Tab = ({ index, tab, setIsOpen, ...props }) => {
   const { t } = useTranslation()
   const location = useLocation()
   const { switchTab, removeTab } = useTabs()
   return (
      <StyledTab
         key={tab.path}
         onClick={() => {
            switchTab(tab.path)
            setIsOpen(false)
         }}
         active={tab.path === location.pathname}
         {...props}
      >
         <span title={tab.title}>{tab.title}</span>
         <div
            role="button"
            tabIndex={0}
            title={t(address.concat('close tab'))}
            onClick={e => removeTab(e, { tab, index })}
            onKeyPress={e => e.charCode === 32 && removeTab(e, { tab, index })}
         >
            <CloseIcon color="#000" size="20" />
         </div>
      </StyledTab>
   )
}
