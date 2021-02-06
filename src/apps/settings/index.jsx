import React from 'react'

import App from './App'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const Settings = () => (
   <TooltipProvider app="Settings App">
      <AccessProvider app="Settings App">
         <App />
      </AccessProvider>
   </TooltipProvider>
)

export default Settings
