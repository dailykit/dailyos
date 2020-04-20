import React from 'react'

import { AuthProvider, TabProvider } from './context'

const OnlineStore = () => (
   <AuthProvider>
      <TabProvider>
         <h1>Online Store App</h1>
      </TabProvider>
   </AuthProvider>
)

export default OnlineStore
