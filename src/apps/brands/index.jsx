import React from 'react'
import Keycloak from 'keycloak-js'

import App from './App'
import './tableStyle.css'
import { TabProvider } from './context'
import {
   AuthProvider,
   AccessProvider,
   TooltipProvider,
} from '../../shared/providers'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'brands',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const BrandApp = () => (
   <AuthProvider keycloak={keycloak}>
      <TooltipProvider app="Brand App">
         <AccessProvider app="Brand App">
            <TabProvider>
               <App />
            </TabProvider>
         </AccessProvider>
      </TooltipProvider>
   </AuthProvider>
)

export default BrandApp
