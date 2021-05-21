import React from 'react'
import { Route } from 'react-router-dom'

import { Carts } from './views'
import { useTabs } from '../../shared/providers'
import { ErrorBoundary } from '../../shared/components'

const App = () => {
   const { addTab, setRoutes } = useTabs()

   React.useEffect(() => {
      setRoutes([
         {
            id: 1,
            title: 'Carts',
            onClick: () => addTab('Carts', '/carts'),
         },
      ])
   }, [])
   return (
      <ErrorBoundary rootRoute="/apps/carts">
         <Route exact path="/carts">
            <Carts />
         </Route>
      </ErrorBoundary>
   )
}

export default App
