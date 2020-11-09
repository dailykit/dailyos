import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

import { ErrorBoundary, Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

// Views
import {
   Home,
   CollectionForm,
   CollectionsListing,
   RecurrencesForm,
} from '../../views'

const Main = () => {
   const { canAccessRoute, accessPermission } = useAccess()
   return (
      <main>
         <Switch>
            <Route path="/menu" exact>
               {canAccessRoute('home') ? (
                  <ErrorBoundary rootRoute="/apps/menu">
                     <Home />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'home')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access menu app.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/menu/collections" exact>
               {canAccessRoute('collections') ? (
                  <ErrorBoundary rootRoute="/apps/menu">
                     <CollectionsListing />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'collections')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access collections listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/menu/collections/:id" exact>
               {canAccessRoute('collection') ? (
                  <ErrorBoundary rootRoute="/apps/menu">
                     <CollectionForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'collection')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access collection details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/menu/recurrences/:type" exact>
               {canAccessRoute('recurrence') ? (
                  <ErrorBoundary rootRoute="/apps/menu">
                     <RecurrencesForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'recurrence')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see recurrence details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
         </Switch>
      </main>
   )
}

export default Main
