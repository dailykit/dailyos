import React from 'react'

import App from './App'
import { TabProvider } from './context'
import {
   AuthProvider,
   AccessProvider,
   TooltipProvider,
} from '../../shared/providers'

const Recipe = () => (
   <TooltipProvider app="Products App">
      <AccessProvider app="Products App">
         <TabProvider>
            <App />
         </TabProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default Recipe
