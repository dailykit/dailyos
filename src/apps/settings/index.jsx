import React from 'react'

import { AuthProvider, TabProvider } from './context'

import App from './App'

const Settings = () => (
   //<AuthProvider>
      <TabProvider>
         <App />
      </TabProvider>
   //</AuthProvider>
)

export default Settings
