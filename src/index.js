import React from 'react'
import { render } from 'react-dom'
import Loadable from 'react-loadable'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

// Toasts
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Apollo Client Imports
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

//i18next
import './i18next'

import './global.css'

import { StyledLoader } from './styled'

import { Lang } from './shared/components'

import { useTranslation, Trans } from 'react-i18next'
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

const wsLink = new WebSocketLink({
   uri: process.env.REACT_APP_DATA_HUB_SUBSCRIPTIONS_URI,
   options: {
      reconnect: true,
   },
})

const httpLink = new HttpLink({
   uri: process.env.REACT_APP_DATA_HUB_URI,
})

const link = split(
   ({ query }) => {
      const definition = getMainDefinition(query)
      return (
         definition.kind === 'OperationDefinition' &&
         definition.operation === 'subscription'
      )
   },
   wsLink,
   httpLink
)

const client = new ApolloClient({
   link,
   cache: new InMemoryCache(),
})

render(
   <ApolloProvider client={client}>
      <ToastContainer
         position="top-right"
         autoClose={3000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
      />
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
            </Route>
            <Route path="/inventory" component={Inventory} />
            <Route path="/recipe" component={Recipe} />
            <Route path="/online-store" component={OnlineStore} />
            <Route path="/settings" component={Settings} />
         </Switch>
      </Router>
      <Lang />
   </ApolloProvider>,
   document.getElementById('root')
)
