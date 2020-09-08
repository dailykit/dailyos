import React from 'react'

import { AuthProvider, TabProvider } from './context'

import App from './App'

import '@dailykit/react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import '@dailykit/react-tabulator/lib/styles.css'
import './tableStyle.css'

const Subscription = () => (
   <AuthProvider>
      <TabProvider>
         <App />
      </TabProvider>
   </AuthProvider>
)

export default Subscription
