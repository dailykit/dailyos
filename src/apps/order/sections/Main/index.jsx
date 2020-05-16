import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Orders } from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/order" exact>
               <Home />
            </Route>
            <Route path="/order/orders" exact>
               <Orders />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
