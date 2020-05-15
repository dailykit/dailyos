import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import Loadable from 'react-loadable'
import { Lang } from './shared/components'

import { StyledLoader } from './styled'

const Loader = () => (
   <StyledLoader>
      <img src="/assets/loader.gif" alt="Loading..." />
   </StyledLoader>
)

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

const App = () => {
   return (
      <>
         <Router>
            <Switch>
               <Route path="/" exact>
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
               </Route>
               <Route path="/inventory" component={Inventory} />
               <Route path="/recipe" component={Recipe} />
               <Route path="/online-store" component={OnlineStore} />
               <Route path="/settings" component={Settings} />
               <Route path="/order" component={Order} />
            </Switch>
         </Router>
         <Lang />
      </>
   )
}

export default App
