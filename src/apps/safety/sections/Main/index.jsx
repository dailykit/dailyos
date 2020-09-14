import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, SafetyChecksListing, SafetyForm } from '../../views'

export default function Main() {
   return (
      <main>
         <Switch>
            <Route path="/apps/safety" exact>
               <Home />
            </Route>
            <Route path="/apps/safety/checks" exact>
               <SafetyChecksListing />
            </Route>
            <Route path="/apps/safety/checks/:id" exact>
               <SafetyForm />
            </Route>
         </Switch>
      </main>
   )
}
