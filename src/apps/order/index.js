import React from 'react'

import App from './App'
import { OrderProvider, ConfigProvider } from './context'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const Settings = () => (
   <TooltipProvider app="Order App">
      <AccessProvider app="Order App">
         <ConfigProvider>
            <OrderProvider>
               <App />
            </OrderProvider>
         </ConfigProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default Settings
