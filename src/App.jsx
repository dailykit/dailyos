import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import Loadable from 'react-loadable'
import { Loader } from '@dailykit/ui'
import { Lang } from './shared/components'

const Safety = Loadable({
   loader: () => import('./apps/safety'),
   loading: Loader,
})
const Inventory = Loadable({
   loader: () => import('./apps/inventory'),
   loading: Loader,
})
const Recipe = Loadable({
   loader: () => import('./apps/recipe'),
   loading: Loader,
})
const OnlineStore = Loadable({
   loader: () => import('./apps/online_store'),
   loading: Loader,
})
const Settings = Loadable({
   loader: () => import('./apps/settings'),
   loading: Loader,
})
const Order = Loadable({
   loader: () => import('./apps/order'),
   loading: Loader,
})
const CRM = Loadable({
   loader: () => import('./apps/crm'),
   loading: Loader,
})

const Subscription = Loadable({
   loader: () => import('./apps/subscription'),
   loading: Loader,
})

const App = () => {
   return (
      <>
         <Router basename={process.env.PUBLIC_URL}>
            <Switch>
               <Route path="/" exact>
                  <Link to="/safety">
                     <Trans i18nKey="safety">Safety</Trans>
                  </Link>
                  <Link to="/inventory">
                     <Trans i18nKey="inventory">Inventory</Trans>
                  </Link>
                  <Link to="/recipe">
                     <Trans i18nKey="recipe">Recipe</Trans>
                  </Link>
                  <Link to="/online-store">
                     <Trans i18nKey="online store">Online Store</Trans>
                  </Link>
                  <Link to="/settings">
                     <Trans i18nKey="settings">Settings</Trans>
                  </Link>
                  <Link to="/order">
                     <Trans i18nKey="order">Order</Trans>
                  </Link>
                  <Link to="/crm">
                     <Trans i18nKey="crm">CRM</Trans>
                  </Link>
                  <Link to="/subscription">
                     <Trans i18nKey="subscription">Subscription</Trans>
                  </Link>
               </Route>
               <Route path="/inventory" component={Inventory} />
               <Route path="/safety" component={Safety} />
               <Route path="/recipe" component={Recipe} />
               <Route path="/online-store" component={OnlineStore} />
               <Route path="/settings" component={Settings} />
               <Route path="/order" component={Order} />
               <Route path="/crm" component={CRM} />
               <Route path="/subscription" component={Subscription} />
            </Switch>
         </Router>
         <Lang />
      </>
   )
}

export default App
