import React from 'react'
import { Trans } from 'react-i18next'
import Loadable from 'react-loadable'
import { Loader } from '@dailykit/ui'
import styled from 'styled-components'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { Lang } from './shared/components'

const Safety = Loadable({
   loader: () => import('./apps/safety'),
   loading: Loader,
})
const Inventory = Loadable({
   loader: () => import('./apps/inventory'),
   loading: Loader,
})
const Products = Loadable({
   loader: () => import('./apps/products'),
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

const Insights = Loadable({
   loader: () => import('./apps/insights'),
   loading: Loader,
})

const Brands = Loadable({
   loader: () => import('./apps/brands'),
   loading: Loader,
})

const App = () => {
   return (
      <>
         <Router basename={process.env.PUBLIC_URL}>
            <Switch>
               <Route path="/" exact>
                  <AppList>
                     <AppItem>
                        <Link to="/safety">
                           <Trans i18nKey="safety">Safety</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/inventory">
                           <Trans i18nKey="inventory">Inventory</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/products">
                           <Trans i18nKey="products">Products</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/online-store">
                           <Trans i18nKey="online store">Online Store</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/settings">
                           <Trans i18nKey="settings">Settings</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/order">
                           <Trans i18nKey="order">Order</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/crm">
                           <Trans i18nKey="crm">CRM</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/subscription">
                           <Trans i18nKey="subscription">Subscription</Trans>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/insights">
                           <div>Insights</div>
                        </Link>
                     </AppItem>
                     <AppItem>
                        <Link to="/brands">
                           <div>Brands</div>
                        </Link>
                     </AppItem>
                  </AppList>
               </Route>
               <Route path="/inventory" component={Inventory} />
               <Route path="/safety" component={Safety} />
               <Route path="/products" component={Products} />
               <Route path="/online-store" component={OnlineStore} />
               <Route path="/settings" component={Settings} />
               <Route path="/order" component={Order} />
               <Route path="/crm" component={CRM} />
               <Route path="/subscription" component={Subscription} />
               <Route path="/insights" component={Insights} />
               <Route path="/brands" component={Brands} />
            </Switch>
         </Router>
         <Lang />
      </>
   )
}

export default App

const AppList = styled.ul`
   display: grid;
   margin: 0 auto;
   max-width: 980px;
   grid-gap: 16px;
   padding-top: 16px;
   width: calc(100vw - 40px);
   grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`

const AppItem = styled.li`
   height: 48px;
   list-style: none;
   a {
      width: 100%;
      color: #2f256f;
      height: 100%;
      display: flex;
      border-radius: 2px;
      align-items: center;
      justify-content: center;
      border: 1px solid #e0e0e0;
      text-decoration: none;
      transition: 0.4s ease-in-out;
      :hover {
         background: #f8f8f8;
      }
   }
`
