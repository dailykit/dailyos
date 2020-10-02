import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, SafetyChecksListing, SafetyForm } from '../../views'
import { Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

export default function Main() {
   const { canAccessRoute, accessPermission } = useAccess()
   return (
      <main>
         <Switch>
            <Route path="/safety" exact>
               {canAccessRoute('home') ? (
                  <Home />
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
                           'You do not have sufficient permission to access safety app.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/safety/checks" exact>
               {canAccessRoute('checks') ? (
                  <SafetyChecksListing />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'checks')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see checks listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/safety/checks/:id" exact>
               {canAccessRoute('check') ? (
                  <SafetyForm />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'check')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see check details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
         </Switch>
      </main>
   )
}
