import React from 'react'

import App from './App'
import './tableStyle.css'
import { TabProvider } from './context'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const BrandApp = () => (
   <TooltipProvider app="Brand App">
      <AccessProvider app="Brand App">
         <TabProvider>
            <App />
         </TabProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default BrandApp
