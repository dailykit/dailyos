import React from 'react'

import App from './App'
import { TabProvider } from './context/tabs'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const Inventory = () => {
   return (
      <TooltipProvider app="Inventory App">
         <AccessProvider app="Inventory App">
            <TabProvider>
               <App />
            </TabProvider>
         </AccessProvider>
      </TooltipProvider>
   )
}

export default Inventory
