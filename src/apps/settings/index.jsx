import React from 'react'

import App from './App'
import { TabProvider } from './context'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const Settings = () => (
   <TooltipProvider app="Settings App">
      <AccessProvider app="Settings App">
         <TabProvider>
            <App />
         </TabProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default Settings
