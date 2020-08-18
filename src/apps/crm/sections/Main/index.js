import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   CustomerListing,
   ReferralPlansListing,
   CustomerRelation,
} from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/crm/customers/:id" component={CustomerRelation} />
            <Route path="/crm/customers" component={CustomerListing} />
            <Route
               path="/crm/referral-plans"
               exact
               component={ReferralPlansListing}
            />
            <Route path="/crm" component={Home} exact />
         </Switch>
      </main>
   )
}

export default Main
