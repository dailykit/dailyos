import React from 'react'

import { TabProvider } from './context'
import { TooltipProvider } from '../../shared/providers'

import App from './App'

const CRM = () => (
   <TooltipProvider app="CRM App">
      <TabProvider>
         <App />
      </TabProvider>
   </TooltipProvider>
)

export default CRM
