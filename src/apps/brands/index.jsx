import React from 'react'

import App from './App'
import './tableStyle.css'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const BrandApp = () => (
   <TooltipProvider app="Brand App">
      <AccessProvider app="Brand App">
         <App />
      </AccessProvider>
   </TooltipProvider>
)

export default BrandApp
