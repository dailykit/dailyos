import React from 'react'
import Keycloak from 'keycloak-js'

import { TabProvider } from './context'
import { AuthProvider } from '../../shared/providers'

import App from './App'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'
import './tableStyle.css'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'subscription',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const Subscription = () => (
   <AuthProvider keycloak={keycloak}>
      <TabProvider>
         <App />
      </TabProvider>
   </AuthProvider>
)

export default Subscription
