import React from 'react'
import { useTabs } from '../../providers'
import { StyledTab } from './styled'
import { useLocation } from 'react-router-dom'
import { CloseIcon } from '../../assets/icons'

const Tab = ({ index, tab, ...props }) => {
   const location = useLocation()
   const { switchTab, removeTab } = useTabs()
   const active = tab.path === location.pathname
   return (
      <StyledTab
         key={tab.path}
         onClick={() => switchTab(tab.path)}
         active={active}
         {...props}
      >
         <span title={tab.title}>{tab.title}</span>
         <button
            type="button"
            title="Close Tab"
            onClick={e => {
               e.stopPropagation()
               removeTab({ tab, index })
            }}
         >
            <CloseIcon color={active ? '#367BF5' : '#919699'} size="12" />
         </button>
      </StyledTab>
   )
}
export default Tab
