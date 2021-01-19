import React from 'react'

import App from './App'
import { TabProvider } from './context'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const OnlineStore = () => (
   <TooltipProvider app="Menu App">
      <AccessProvider app="Menu App">
         <TabProvider>
            <App />
         </TabProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default OnlineStore
