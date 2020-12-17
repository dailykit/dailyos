import React from 'react'
import { ThemeProvider } from 'styled-components'

// State
import { Context, initialState, reducers } from './state'

// Sections
import { Sidebar, Main, SidePanel } from './sections'

// Styles
import { Wrapper } from './styles'

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
      <ThemeProvider theme={theme}>
         <Context.Provider value={{ state, dispatch }}>
            <Wrapper column={gridColumns()}>
               <Sidebar />
               <Main />
               <SidePanel />
            </Wrapper>
         </Context.Provider>
      </ThemeProvider>
   )
}

export default App
