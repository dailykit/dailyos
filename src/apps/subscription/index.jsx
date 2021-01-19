import React from 'react'

import { TabProvider } from './context'
import { AccessProvider, TooltipProvider } from '../../shared/providers'

import App from './App'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'
import './tableStyle.css'

const Subscription = () => (
   <TooltipProvider app="Subscription App">
      <AccessProvider app="Subscription App">
         <TabProvider>
            <App />
         </TabProvider>
      </AccessProvider>
   </TooltipProvider>
)

export default Subscription
