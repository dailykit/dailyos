import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'

import { useGlobalContext } from './context'

// Sections
import { Sidebar, Main, SidePanel, Header } from './sections'
import ErrorBoundary from '../../shared/components/ErrorBoundary'

// Styles
import { Wrapper } from './styles'
import { StyledWrapper } from '../../styled'

const theme = {
   basePt: 8,
   colors: {
      light: '#efefef',
      grey: {
         light: '#b5b5b5',
      },
   },
   border: {
      color: '#E0C9C9',
   },
}

const App = () => {
   const { toggleSideBar, globalState } = useGlobalContext()
   const [isSidebarVisible, setIsSidebarVisible] = React.useState(false)
   const sideBarHandler = () => {
      setIsSidebarVisible(!isSidebarVisible)
      toggleSideBar()
   }
   const gridColumns = () => {
      let column = '240px 1fr 240px'
      if (globalState.isSidebarVisible && globalState.isSidePanelVisible) {
         column = '240px 1fr 280px'
      } else if (
         globalState.isSidebarVisible &&
         !globalState.isSidePanelVisible
      ) {
         column = '240px 1fr 40px'
      } else if (
         !globalState.isSidebarVisible &&
         globalState.isSidePanelVisible
      ) {
         column = '0px 1fr 280px'
      } else {
         column = '0px 1fr 40px'
      }
      return column
   }
   return (
      <StyledWrapper>
         <ThemeProvider theme={theme}>
            {/* <Context.Provider value={{ state, dispatch }}> */}
            {/* <Header toggleSidebar={setIsSidebarVisible} /> */}
            {/* <Router basename={process.env.PUBLIC_URL}>
                  <Sidebar />
                  <Main />
                  <SidePanel />
                  </Wrapper>
               </Router> */}
            <Router basename={process.env.PUBLIC_URL}>
               <Header toggleSidebar={sideBarHandler} />
               <Wrapper column={gridColumns()}>
                  <Sidebar
                     visible={isSidebarVisible}
                     toggleSidebar={sideBarHandler}
                  />
                  <ErrorBoundary rootRoute="/apps/crm">
                     <Main />
                  </ErrorBoundary>
                  <SidePanel />
               </Wrapper>
            </Router>
            {/* </Context.Provider> */}
         </ThemeProvider>
      </StyledWrapper>
   )
}

export default App
