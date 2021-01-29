import React from 'react'
import { render } from 'react-dom'
import i18n from 'i18next'
import Keycloak from 'keycloak-js'
import { initReactI18next } from 'react-i18next'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { BrowserRouter as Router } from 'react-router-dom'

// Toasts
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Apollo Client Imports
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import Backend from 'i18next-http-backend'

import App from './App'
import { AuthProvider, TabProvider } from './shared/providers'

import './global.css'

const languages = ['en', 'fr', 'es', 'he', 'de', 'el', 'hi', 'it']

Sentry.init({
   dsn:
      'https://55533db4419a47f1b4416c0512a608ad@o460444.ingest.sentry.io/5460641',
   integrations: [new Integrations.BrowserTracing()],

   // We recommend adjusting this value in production, or using tracesSampler
   // for finer control
   tracesSampleRate: 1.0,
})

const authLink = setContext((_, { headers }) => {
   return {
      headers: {
         ...headers,
         'x-hasura-admin-secret': `${process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET}`,
      },
   }
})

const wsLink = new WebSocketLink({
   uri: process.env.REACT_APP_DATA_HUB_SUBSCRIPTIONS_URI,
   options: {
      reconnect: true,
      connectionParams: {
         headers: {
            'x-hasura-admin-secret': `${process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET}`,
         },
      },
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
   authLink.concat(httpLink)
)

const client = new ApolloClient({
   link,
   cache: new InMemoryCache(),
})

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'apps',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
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
            <AuthProvider keycloak={keycloak}>
               <Router basename={process.env.PUBLIC_URL}>
                  <TabProvider>
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
                  </TabProvider>
               </Router>
            </AuthProvider>
         </ApolloProvider>,
         document.getElementById('root')
      )
   )
