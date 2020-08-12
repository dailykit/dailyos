import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Menu, Subscriptions, Subscription } from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/subscription" exact>
               <Home />
            </Route>
            <Route path="/subscription/menu" exact>
               <Menu />
            </Route>
            <Route path="/subscription/subscriptions" exact>
               <Subscriptions />
            </Route>
            <Route path="/subscription/subscriptions/:id" exact>
               <Subscription />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
