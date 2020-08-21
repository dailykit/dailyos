import React from 'react'
import { render } from 'react-dom'
import Loadable from 'react-loadable'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Loader } from '@dailykit/ui'

// Toasts
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Apollo Client Imports
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import Backend from 'i18next-http-backend'

import './global.css'

const languages = ['en', 'fr', 'es', 'he', 'de', 'el', 'hi', 'it']

const App = Loadable({
   loader: () => import('./App'),
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

i18n
   .use(Backend)
   .use(initReactI18next)
   .init({
      backend: {
         loadPath: '/apps/locales/{{lng}}/{{ns}}.json',
      },
      lng: 'en',
      fallbackLng: false,
      debug: false,
      whitelist: languages,
      interpolation: {
         escapeValue: false,
      },
      react: {
         wait: true,
         useSuspense: false,
      },
   })
   .then(() =>
      render(
         <ApolloProvider client={client}>
            <ToastContainer
               position="bottom-left"
               autoClose={3000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
            />
            <App />
         </ApolloProvider>,
         document.getElementById('root')
      )
   )
