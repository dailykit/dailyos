import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Menu, Subscriptions, Subscription } from '../../views'
import { Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/subscription" exact>
               <AccessCheck
                  title="home"
                  message="You do not have sufficient permission to see subscription app."
               >
                  <Home />
               </AccessCheck>
            </Route>
            <Route path="/subscription/menu" exact>
               <AccessCheck
                  title="menu"
                  message="You do not have sufficient permission to see menu page."
               >
                  <Menu />
               </AccessCheck>
            </Route>
            <Route path="/subscription/subscriptions" exact>
               <AccessCheck
                  title="subscriptions"
                  message="You do not have sufficient permission to see subscription listing."
               >
                  <Subscriptions />
               </AccessCheck>
            </Route>
            <Route path="/subscription/subscriptions/:id" exact>
               <AccessCheck
                  title="subscription"
                  message="You do not have sufficient permission to see subscription details."
               >
                  <Subscription />
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
      children
   ) : (
      <Flex container height="100%" alignItems="center" justifyContent="center">
         <Text as="title">
            {accessPermission('ROUTE_READ', title)?.fallbackMessage || message}
         </Text>
      </Flex>
   )
}
