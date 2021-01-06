import React from 'react'
import { TabPanels } from '@reach/tabs'
import { Switch, Route } from 'react-router-dom'
// State
import { Context } from '../../state'
import { useTabs } from '../../context'

// Components
import { Home, Editor } from '../../views'

// Styles
import {
   MainWrapper,
   TabsNav,
   TabOptions,
   StyledTabs,
   StyledTabList,
   StyledTab,
   StyledTabPanel,
} from './styles'

// Assets
import {
   CloseIcon,
   CaretLeftIcon,
   CaretRightIcon,
   CaretDownIcon,
   CaretUpIcon,
} from '../../assets/Icons'

const Main = () => {
   const { tab, tabs } = useTabs()
   const { state, dispatch } = React.useContext(Context)
   const mainWidth = () => {
      let width = '100vw'
      if (state.isSidebarVisible && state.isSidePanelVisible) {
         width = `calc(${width} - 480px)`
      } else if (state.isSidebarVisible && !state.isSidePanelVisible) {
         width = `calc(${width} - 280px)`
      } else if (!state.isSidebarVisible && state.isSidePanelVisible) {
         width = `calc(${width} - 320px)`
      } else {
         width = `calc(${width} - 80px)`
      }
      return width
   }

   // if (tabs.length === 0) {
   //    return <main id="main">Select a file from the explorer.</main>
   // }
   return (
      // <MainWrapper width={mainWidth()}>
      <main>
         <Switch>
            <Route path="/editor" component={Home} exact />
            <Route path="/editor/:path+" component={Editor} exact />
         </Switch>
         {/* <StyledTabs
         index={state.currentTab}
         onChange={() =>
            dispatch({ type: 'SET_TAB_INDEX', payload: currentTab })
         }
         > */}
         {/* <StyledTabList>
               {tabs.map((tab, index) => (
                  <StyledTab key={index}>
                     <span title={tab.name}>{`${
                        tab.name.length > 12
                           ? `${tab.name.slice(0, 10)}...`
                           : tab.name
                     }`}</span>
                     <span
                        onClick={e => {
                           e.stopPropagation()
                           dispatch({
                              type: 'REMOVE_TAB',
                              payload: index,
                           })
                        }}
                     >
                        {CloseIcon}
                     </span>
                  </StyledTab>
               ))}
            </StyledTabList> */}

         {/* <TabPanels>
               {tabs.map((tab, index) => (
                  <StyledTabPanel key={index}>
                     <Editor {...tab} />
                  </StyledTabPanel>
               ))}
            </TabPanels>
         </StyledTabs> */}
         {/* <TabsNav>
            <span onClick={() => dispatch({ type: 'LEFT_TAB' })}>
               {CaretLeftIcon}
            </span>
            <span onClick={() => dispatch({ type: 'RIGHT_TAB' })}>
               {CaretRightIcon}
            </span>
            <span
               onClick={() =>
                  dispatch({
                     type: 'TOGGLE_TAB_DROPDOWN',
                     payload: !state.isTabDropDownVisible,
                  })
               }
            >
               {state.isTabDropDownVisible ? CaretUpIcon : CaretDownIcon}
            </span>
            {state.isTabDropDownVisible && (
               <TabOptions>
                  <ul>
                     <li onClick={() => dispatch({ type: 'CLOSE_ALL_TABS' })}>
                        Close All Tabs
                     </li>
                  </ul>
               </TabOptions>
            )}
         </TabsNav> */}
         {/* </MainWrapper> */}
      </main>
   )
}

export default Main
