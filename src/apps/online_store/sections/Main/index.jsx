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
   StoreSettingsForm,
   RecurrencesForm,
} from '../../views'

const Main = () => {
   const { canAccessRoute, accessPermission } = useAccess()
   return (
      <main>
         <Switch>
            <Route path="/online-store" exact>
               {canAccessRoute('home') ? (
                  <ErrorBoundary rootRoute="/apps/online-store">
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
                           'You do not have sufficient permission to access online store.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/online-store/collections" exact>
               {canAccessRoute('collections') ? (
                  <ErrorBoundary rootRoute="/apps/online-store">
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
            <Route path="/online-store/collections/:id" exact>
               {canAccessRoute('collection') ? (
                  <ErrorBoundary rootRoute="/apps/online-store">
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
            <Route path="/online-store/settings" exact>
               {canAccessRoute('settings') ? (
                  <ErrorBoundary rootRoute="/apps/online-store">
                     <StoreSettingsForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'settings')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see store settings.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/online-store/settings/recurrences/:type" exact>
               {canAccessRoute('recurrence') ? (
                  <ErrorBoundary rootRoute="/apps/online-store">
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
