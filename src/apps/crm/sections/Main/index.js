import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   CustomerListing,
   CustomerRelation,
   CouponListing,
   CouponForm,
   CampaignListing,
   CampaignForm,
} from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route
               path="/crm/customers/:id"
               component={CustomerRelation}
               exact
            />
            <Route path="/crm/customers" component={CustomerListing} exact />
            <Route path="/crm/coupons/:id" exact component={CouponForm} />
            <Route path="/crm/campaign/:id" exact component={CampaignForm} />
            <Route path="/crm/coupons" component={CouponListing} exact />
            <Route path="/crm/campaign" component={CampaignListing} exact />
            <Route path="/crm" component={Home} exact />
         </Switch>
      </main>
   )
}

export default Main
