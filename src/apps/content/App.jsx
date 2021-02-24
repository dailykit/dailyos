import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'
import './views/Listings/tableStyle.css'

// Sections
import Header from './sections/Header'
import Sidebar from './sections/Sidebar'
import Main from './sections/Main'
import ErrorBoundary from '../../shared/components/ErrorBoundary'
import BrandContext from './context/Brand'
import ConfigContext from './context/Config'

// Styled
import { StyledWrapper } from '../../styled'

const App = () => {
   const [isSidebarVisible, toggleSidebar] = React.useState(false)
   const [context, setContext] = React.useState({
      brandId: 0,
      brandName: '',
      websiteId: 0,
      brandDomain: '',
   })
   const [configContext, setConfigContext] = React.useState({})
   return (
      <StyledWrapper>
         <ConfigContext.Provider value={[configContext, setConfigContext]}>
            <BrandContext.Provider value={[context, setContext]}>
               <Router basename={process.env.PUBLIC_URL}>
                  <Header toggleSidebar={toggleSidebar} />
                  <Sidebar
                     visible={isSidebarVisible}
                     toggleSidebar={toggleSidebar}
                  />
                  <ErrorBoundary rootRoute="/apps/content">
                     <Main />
                  </ErrorBoundary>
               </Router>
            </BrandContext.Provider>
         </ConfigContext.Provider>
      </StyledWrapper>
   )
}

export default App
