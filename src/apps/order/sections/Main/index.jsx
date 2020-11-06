import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

import {
   Home,
   Orders,
   Order,
   Planned,
   InventoryProduct,
   ReadyToEatProduct,
} from '../../views'
import { useAccess } from '../../../../shared/providers'
import { Flex, ErrorBoundary } from '../../../../shared/components'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/apps/order" exact>
               <AccessCheck
                  title="home"
                  message="You do not have sufficient permission to access order app."
               >
                  <Home />
               </AccessCheck>
            </Route>
            <Route path="/apps/order/orders" exact>
               <AccessCheck
                  title="orders"
                  message="You do not have sufficient permission to access orders listing."
               >
                  <Orders />
               </AccessCheck>
            </Route>
            <Route path="/apps/order/orders/:id" exact>
               <AccessCheck
                  title="order"
                  message="You do not have sufficient permission to access order details."
               >
                  <Order />
               </AccessCheck>
            </Route>
            <Route path="/apps/order/planned" exact>
               <AccessCheck
                  title="planned"
                  message="You do not have sufficient permission to access planned mode."
               >
                  <Planned />
               </AccessCheck>
            </Route>
            <Route path="/apps/order/planned/inventory/:id" exact>
               <AccessCheck
                  title="planned/inventory"
                  message="You do not have sufficient permission to access planned inventory product."
               >
                  <InventoryProduct />
               </AccessCheck>
            </Route>
            <Route path="/apps/order/planned/ready-to-eat/:id" exact>
               <AccessCheck
                  title="planned/ready-to-eat"
                  message="You do not have sufficient permission to access planned ready to eat product."
               >
                  <ReadyToEatProduct />
               </AccessCheck>
            </Route>
         </Switch>
      </main>
   )
}

export default Main

const AccessCheck = ({ title, children, message }) => {
   const { canAccessRoute, accessPermission } = useAccess()
   return canAccessRoute(title) ? (
      <ErrorBoundary rootRoute="/apps/order">{children}</ErrorBoundary>
   ) : (
      <Flex container height="100%" alignItems="center" justifyContent="center">
         <Text as="title">
            {accessPermission('ROUTE_READ', title)?.fallbackMessage || message}
         </Text>
      </Flex>
   )
}
