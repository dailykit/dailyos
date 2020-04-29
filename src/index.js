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
               <Link to="/inventory">Inventory</Link>
               <Link to="/recipe">Recipe</Link>
               <Link to="/online-store">Online Store</Link>
               <Link to="/settings">Settings</Link>
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
