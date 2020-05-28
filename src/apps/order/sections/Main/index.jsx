import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Orders, Order } from '../../views'

const Main = () => {
   return (
      <main style={{ overflowY: 'auto', height: 'calc(100vh - 40px)' }}>
         <Switch>
            <Route path="/order" exact>
               <Home />
            </Route>
            <Route path="/order/orders" exact>
               <Orders />
            </Route>
            <Route path="/order/orders/:id" exact>
               <Order />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
