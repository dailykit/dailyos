import React from 'react'
import Keycloak from 'keycloak-js'

import { TabProvider } from './context'
import { AuthProvider, TooltipProvider } from '../../shared/providers'

import App from './App'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'crm',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const CRM = () => (
   <AuthProvider keycloak={keycloak}>
      <TooltipProvider app="CRM App">
         <TabProvider>
            <App />
         </TabProvider>
      </TooltipProvider>
   </AuthProvider>
)

export default CRM
