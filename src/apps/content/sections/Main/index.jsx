import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Blocks } from '../../views'

export default function Main() {
   return (
      <main>
         <Switch>
            <Route path="/content" exact>
               <Home />
            </Route>
            <Route path="/content/blocks" exact>
               <Blocks />
            </Route>
         </Switch>
      </main>
   )
}
