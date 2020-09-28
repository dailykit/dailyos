import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   Orders,
   Order,
   Planned,
   InventoryProduct,
   ReadyToEatProduct,
} from '../../views'
import { Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

const Main = () => {
   const { canAccessRoute, accessPermission } = useAccess()

   return (
      <main>
         <Switch>
            <Route path="/apps/order" exact>
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
                           'You do not have sufficient permission to access order app.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/apps/order/orders" exact>
               {canAccessRoute('orders') ? (
                  <Orders />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'orders')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access orders listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/apps/order/orders/:id" exact>
               {canAccessRoute('order') ? (
                  <Order />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'order')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access order details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/apps/order/planned" exact>
               {canAccessRoute('planned') ? (
                  <Planned />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ')?.fallbackMessage ||
                           'You do not have sufficient permission to access planned mode.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/apps/order/planned/inventory/:id" exact>
               {canAccessRoute('planned/inventory') ? (
                  <InventoryProduct />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'planned/inventory')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access planned inventory product.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/apps/order/planned/ready-to-eat/:id" exact>
               {canAccessRoute('planned/ready-to-eat') ? (
                  <ReadyToEatProduct />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'planned/ready-to-eat')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access planned ready to eat product.'}
                     </Text>
                  </Flex>
               )}
            </Route>
         </Switch>
      </main>
   )
}

export default Main
