import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Menu } from '../../views'

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
         </Switch>
      </main>
   )
}

export default Main
