import React from 'react'
import Keycloak from 'keycloak-js'

import App from './App'
import { TabProvider } from './context'
import {
   AuthProvider,
   AccessProvider,
   TooltipProvider,
} from '../../shared/providers'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'editor',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

// Components
const EditorApp = () => (
   <AuthProvider keycloak={keycloak}>
      <TooltipProvider app="Editor App">
         <TabProvider>
            <App />
         </TabProvider>
      </TooltipProvider>
   </AuthProvider>
)

export default EditorApp
