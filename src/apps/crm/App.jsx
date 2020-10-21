import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'
import './views/tableStyle.css'
// Sections
import Header from './sections/Header'
import Sidebar from './sections/Sidebar'
import Main from './sections/Main'
import ErrorBoundary from '../../shared/components/ErrorBoundary'

// Styled
import { StyledWrapper } from '../../styled'

const App = () => {
   const [isSidebarVisible, toggleSidebar] = React.useState(false)
   return (
      <StyledWrapper>
         <Router basename={process.env.PUBLIC_URL}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar visible={isSidebarVisible} toggleSidebar={toggleSidebar} />
            <ErrorBoundary rootRoute="/apps/recipe">
               <Main />
            </ErrorBoundary>
         </Router>
      </StyledWrapper>
   )
}

export default App
