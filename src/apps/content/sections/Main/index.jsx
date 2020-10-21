import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Blocks} from '../../views'
import {InformationGrid,FAQS, AddInfoGrid, AddFAQ} from '../../views/Forms/'


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
            <Route path="/content/blocks/faq/:id">
               <FAQS />
            </Route>
            <Route path="/content/blocks/grid/:id">
               <InformationGrid/>
            </Route>
            <Route path="/content/blocks/grid-form" exact>
               <AddInfoGrid/>
            </Route>
            <Route path="/content/blocks/faq-form" exact>
               <AddFAQ/>
            </Route>
         </Switch>
      </main>
   )
}
