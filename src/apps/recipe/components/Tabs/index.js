import React from 'react'

// State
import { Context } from '../../store/tabs'

// Styled
import { StyledTabs, StyledTab } from './styled'

// Icons
import { CloseIcon } from '../../assets/icons'

const Tabs = () => {
   const { state, dispatch } = React.useContext(Context)
   const switchTab = tab => {
      dispatch({
         type: 'SWITCH_TAB',
         payload: { ...tab },
      })
   }
   const removeTab = (e, tab) => {
      e.stopPropagation()
      dispatch({ type: 'DELETE_TAB', payload: tab })
   }
   return (
      <StyledTabs>
         {['listings', 'forms'].map(type =>
            state[type].map((tab, index) => (
               <StyledTab
                  key={tab.title}
                  onClick={() => switchTab(tab)}
                  active={tab.title === state.current.title}
               >
                  <span title={tab.title}>{tab.title}</span>
                  {tab.title === state.current.title && (
                     <div
                        title="Close Tab"
                        onClick={e => removeTab(e, { ...tab, index })}
                     >
                        <CloseIcon color="#000" size="20" />
                     </div>
                  )}
               </StyledTab>
            ))
         )}
      </StyledTabs>
   )
}

export default Tabs