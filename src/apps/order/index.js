import React from 'react'

import { TabProvider, OrderProvider, ConfigProvider } from './context'

import App from './App'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

const Settings = () => (
   <TooltipProvider app="Order App">
      <AccessProvider app="Order App">
         <ConfigProvider>
            <TabProvider>
               <OrderProvider>
                  <App />
               </OrderProvider>
            </TabProvider>
         </ConfigProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default Settings
