import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'
import './views/Listings/tableStyle.css'

import Main from './sections/Main'
import { useTabs } from './context'
import Header from './sections/Header'
import { StyledWrapper } from '../../styled'
import { ErrorBoundary, Sidebar } from '../../shared/components'

const App = () => {
   const { addTab } = useTabs()
   const [isSidebarVisible, toggleSidebar] = React.useState(false)
   const links = React.useMemo(
      () => [
         {
            id: 1,
            title: 'Users',
            onClick: () => addTab('Users', '/settings/users'),
         },
         {
            id: 2,
            title: 'Devices',
            onClick: () => addTab('Devices', '/settings/devices'),
         },
         {
            id: 3,
            title: 'Roles',
            onClick: () => addTab('Roles', '/settings/roles'),
         },
         {
            id: 4,
            title: 'Apps',
            onClick: () => addTab('Apps', '/settings/apps'),
         },
         {
            id: 5,
            title: 'Stations',
            onClick: () => addTab('Stations', '/settings/stations'),
         },
      ],
      []
   )
   return (
      <StyledWrapper>
         <Router basename={process.env.PUBLIC_URL}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar
               links={links}
               open={isSidebarVisible}
               toggle={toggleSidebar}
            />
            <ErrorBoundary rootRoute="/apps/settings">
               <Main />
            </ErrorBoundary>
         </Router>
      </StyledWrapper>
   )
}

export default App
