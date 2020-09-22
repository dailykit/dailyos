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
import { useAccess } from '../../context'
import { Flex } from '../../../../shared/components'

const Main = () => {
   const { canAccessRoute, accessPermission } = useAccess()

   return (
      <main>
         <Switch>
            <Route path="/apps/order" exact>
               <Home />
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
               <Order />
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
               <InventoryProduct />
            </Route>
            <Route path="/apps/order/planned/ready-to-eat/:id" exact>
               <ReadyToEatProduct />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
