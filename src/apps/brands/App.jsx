import React from 'react'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'

import Main from './sections/Main'
import { useTabs } from '../../shared/providers'
import { ErrorBoundary } from '../../shared/components'

const App = () => {
   const { addTab, setRoutes } = useTabs()

   React.useEffect(() => {
      setRoutes([
         {
            id: 1,
            title: 'Brands',
            onClick: () => addTab('Brands', '/brands/brands'),
         },
      ])
   }, [])
   return (
      <ErrorBoundary>
         <Main />
      </ErrorBoundary>
   )
}

export default App
