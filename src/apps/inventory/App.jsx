import React from 'react'

import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'

import { Context, state as initialState, reducers } from './context/tabs'

// Sections
import Header from './sections/Header'
import Sidebar from './sections/Sidebar'
import Main from './sections/Main'

// Styled
import { StyledWrapper } from '../../styled'

const App = () => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [isSidebarVisible, toggleSidebar] = React.useState(false)
   return (
      <StyledWrapper>
         <Context.Provider value={{ state, dispatch }}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar visible={isSidebarVisible} toggleSidebar={toggleSidebar} />
            <Main />
         </Context.Provider>
      </StyledWrapper>
   )
}

export default App
