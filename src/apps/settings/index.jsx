import React from 'react'

import { AuthProvider, TabProvider } from './context'

const Settings = () => (
   <AuthProvider>
      <TabProvider>
         <h1>Settings App</h1>
      </TabProvider>
   </AuthProvider>
)

export default Settings
