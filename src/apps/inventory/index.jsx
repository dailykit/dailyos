import React from 'react'
import Keycloak from 'keycloak-js'

import App from './App'
import { TabProvider } from './context/tabs'
import { AuthProvider } from '../../shared/providers'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'inventory',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const Inventory = () => {
   if (process.env.NODE_ENV === 'development') return <App />

   return (
      <AuthProvider keycloak={keycloak}>
         <TabProvider>
            <App />
         </TabProvider>
      </AuthProvider>
   )
}

export default Inventory
