import React from 'react'

import App from './App'
import { TabProvider } from './context'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const SafetyApp = () => (
   <TooltipProvider app="Safety App">
      <AccessProvider app="Safety App">
         <TabProvider>
            <App />
         </TabProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default SafetyApp
