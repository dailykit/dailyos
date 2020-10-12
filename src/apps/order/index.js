import React from 'react'
import Keycloak from 'keycloak-js'

import { TabProvider, OrderProvider, ConfigProvider } from './context'

import App from './App'
import {
   AuthProvider,
   AccessProvider,
   TooltipProvider,
} from '../../shared/providers'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'order',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const Settings = () => (
   <AuthProvider keycloak={keycloak}>
      <TooltipProvider app="Order App">
         <AccessProvider app="Order App">
            <ConfigProvider>
               <TabProvider>
                  <OrderProvider>
                     <App />
                  </OrderProvider>
               </TabProvider>
            </ConfigProvider>
         </AccessProvider>
      </TooltipProvider>
   </AuthProvider>
)

export default Settings
