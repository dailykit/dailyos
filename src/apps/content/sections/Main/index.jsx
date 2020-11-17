import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Blocks } from '../../views'
import { AddInfoGrid, AddFAQ } from '../../views/Forms/'

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
            <Route exact path="/content/blocks/grid-form/:id">
               <AddInfoGrid />
            </Route>
            <Route exact path="/content/blocks/faq-form/:id">
               <AddFAQ />
            </Route>
         </Switch>
      </main>
   )
}
