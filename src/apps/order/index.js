import React from 'react'

import { AuthProvider, TabProvider, OrderProvider } from './context'

import App from './App'

const Settings = () => (
   <AuthProvider>
      <TabProvider>
         <OrderProvider>
            <App />
         </OrderProvider>
      </TabProvider>
   </AuthProvider>
)

export default Settings
