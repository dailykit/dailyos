import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, SafetyChecksListing, SafetyForm } from '../../views'

export default function Main() {
   return (
      <main>
         <Switch>
            <Route path="/safety" exact>
               <Home />
            </Route>
            <Route path="/safety/checks" exact>
               <SafetyChecksListing />
            </Route>
            <Route path="/safety/checks/:id" exact>
               <SafetyForm />
            </Route>
         </Switch>
      </main>
   )
}
