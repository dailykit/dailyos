import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Brands } from '../../views'
import { Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

export default function Main() {
   const { canAccessRoute, accessPermission } = useAccess()
   return (
      <main>
         <Switch>
            <Route path="/brands" exact>
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
                           'You do not have sufficient permission to access brands app.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/brands/brands" exact>
               {canAccessRoute('brands') ? (
                  <Brands />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'brands')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access brands listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
         </Switch>
      </main>
   )
}
