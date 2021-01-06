import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'

// State
import { Context, initialState, reducers } from './state'

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
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [isSidebarVisible, toggleSidebar] = React.useState(false)
   const gridColumns = () => {
      let column = '240px 1fr 240px'
      if (state.isSidebarVisible && state.isSidePanelVisible) {
         column = '200px 1fr 280px'
      } else if (state.isSidebarVisible && !state.isSidePanelVisible) {
         column = '240px 1fr 40px'
      } else if (!state.isSidebarVisible && state.isSidePanelVisible) {
         column = '40px 1fr 280px'
      } else {
         column = '40px 1fr 40px'
      }
      return column
   }
   return (
      <StyledWrapper>
         <ThemeProvider theme={theme}>
            <Context.Provider value={{ state, dispatch }}>
               {/* <Router basename={process.env.PUBLIC_URL}>
                  <Header toggleSidebar={toggleSidebar} />
                  <Wrapper column={gridColumns()}>
                  <Sidebar />
                  <Main />
                  <SidePanel />
                  </Wrapper>
               </Router> */}
               <Router basename={process.env.PUBLIC_URL}>
                  <Header toggleSidebar={toggleSidebar} />
                  <Sidebar
                     visible={isSidebarVisible}
                     toggleSidebar={toggleSidebar}
                  />
                  <ErrorBoundary rootRoute="/apps/crm">
                     <Main />
                  </ErrorBoundary>
               </Router>
            </Context.Provider>
         </ThemeProvider>
      </StyledWrapper>
   )
}

export default App
