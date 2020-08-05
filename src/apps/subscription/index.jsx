import React from 'react'

import { AuthProvider, TabProvider } from './context'

import App from './App'

import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'

const Subscription = () => (
   // <AuthProvider>
   <TabProvider>
      <App />
   </TabProvider>
   // </AuthProvider>
)

export default Subscription
