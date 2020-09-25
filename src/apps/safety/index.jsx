import React from 'react'
import Keycloak from 'keycloak-js'

import App from './App'
import { TabProvider } from './context'
import { AuthProvider } from '../../shared/providers'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'safety-app',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const SafetyApp = () => (
   <AuthProvider keycloak={keycloak}>
      <TabProvider>
         <App />
      </TabProvider>
   </AuthProvider>
)

export default SafetyApp
