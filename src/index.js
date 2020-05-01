import React from 'react'
import { render } from 'react-dom'
import Loadable from 'react-loadable'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

// Apollo Client Imports
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

//i18next internationalization
import './i18next'
import { Trans } from 'react-i18next'

import './global.css'

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

const client = new ApolloClient({
   link: new HttpLink({
      uri: process.env.REACT_APP_DATA_HUB_URI,
   }),
   cache: new InMemoryCache(),
})

render(
   <ApolloProvider client={client}>
      <Router>
         <Switch>
            <Route path="/" exact>
               <Link to="/inventory"><Trans i18nKey='inventory'>Inventory</Trans></Link>
               <Link to="/recipe"><Trans i18nKey='recipe'>Recipe</Trans></Link>
               <Link to="/online-store"><Trans i18nKey='online store'>Online Store</Trans></Link>
               <Link to="/settings"><Trans i18nKey='settings'>settings</Trans></Link>
            </Route>
            <Route path="/inventory" component={Inventory} />
            <Route path="/recipe" component={Recipe} />
            <Route path="/online-store" component={OnlineStore} />
            <Route path="/settings" component={Settings} />
         </Switch>
      </Router>
   </ApolloProvider>,
   document.getElementById('root')
)
