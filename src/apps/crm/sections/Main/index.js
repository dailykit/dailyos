import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, CustomerListing } from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/crm" exact>
               <Home />
            </Route>
            <Route path="/crm/customers" exact>
               <CustomerListing />
            </Route>
            {/* <Route path="/crm/referral-plans" exact></Route> */}
         </Switch>
      </main>
   )
}

export default Main
