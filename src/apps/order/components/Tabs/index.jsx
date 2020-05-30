import React from 'react'
import { useLocation } from 'react-router-dom'

// State
import { useTabs } from '../../context/tabs'

// Styled
import { StyledTabs, StyledTab } from './styled'

// Icons
import { CloseIcon } from '../../assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.order.components.tabs.'

const Tabs = () => {
   const { t } = useTranslation()
   const location = useLocation()
   const { tabs, switchTab, removeTab } = useTabs()
   return (
      <StyledTabs>
         {tabs.map((tab, index) => (
            <StyledTab
               key={tab.title}
               onClick={() => switchTab(tab.path)}
               active={tab.path === location.pathname}
            >
               <span title={tab.title}>{tab.title}</span>
               {tab.path === location.pathname && (
                  <div
                     role="button"
                     tabIndex={0}
                     title={t(address.concat("close tab"))}
                     onClick={e => removeTab(e, { tab, index })}
                     onKeyPress={e =>
                        e.charCode === 32 && removeTab(e, { tab, index })
                     }
                  >
                     <CloseIcon color="#000" size="20" />
                  </div>
               )}
            </StyledTab>
         ))}
      </StyledTabs>
   )
}

export default Tabs
