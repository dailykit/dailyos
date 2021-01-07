import React from 'react'
import { TabPanels } from '@reach/tabs'
import { Switch, Route } from 'react-router-dom'
// State
import { Context } from '../../state'
import { useGlobalContext, useTabs } from '../../context'
import { FormType, FileType, CreateType } from '../../components/Popup'

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
   const { globalState, setPopupInfo } = useGlobalContext()
   const [createType, setCreateType] = React.useState('')
   const fileTypeRef = React.useRef('')

   const selectFileType = type => {
      fileTypeRef.current = type
      setPopupInfo({
         createTypePopup: false,
         fileTypePopup: false,
         formTypePopup: true,
      })
   }

   const closePopup = () => {
      setPopupInfo({
         createTypePopup: false,
         fileTypePopup: false,
         formTypePopup: false,
      })
   }

   const mainWidth = () => {
      let width = '100vw'
      if (globalState.isSidebarVisible && globalState.isSidePanelVisible) {
         width = `calc(${width} - 480px)`
      } else if (
         globalState.isSidebarVisible &&
         !globalState.isSidePanelVisible
      ) {
         width = `calc(${width} - 280px)`
      } else if (
         !globalState.isSidebarVisible &&
         globalState.isSidePanelVisible
      ) {
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
         <FileType
            show={globalState.popupInfo.fileTypePopup}
            closePopup={closePopup}
            setFileType={type => selectFileType(type)}
         />
         {/* <FormType
            showPopup={showPopup2}
            action="Create"
            treeViewData={nestedFolders}
            nodePath={node?.path?.replace('/', '')}
            nodeType={type}
            name={name}
            setName={name => setName(name)}
            setPath={path => setPath(path)}
            stopDot={e => stopDot(e)}
            cancelPopup={() => setShowPopup2(!showPopup2)}
            mutationHandler={(action, type) =>
               type === 'FOLDER' ? createFolderHandler() : createFileHandler()
            }
         /> */}
         <CreateType
            show={globalState.popupInfo.createTypePopup}
            closePopup={closePopup}
            setCreateType={type => setCreateType(type)}
         />
      </main>
   )
}

export default Main
