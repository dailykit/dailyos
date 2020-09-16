import React from 'react'

import { AuthProvider, TabProvider } from './context'

import App from './App'

const OnlineStore = () => (
   //<AuthProvider>
   <TabProvider>
      <App />
   </TabProvider>
   //</AuthProvider>
)

export default OnlineStore
