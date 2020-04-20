import React from 'react'

import { AuthProvider, TabProvider } from './context'

const Inventory = () => (
   <AuthProvider>
      <TabProvider>
         <h1>Inventory App</h1>
      </TabProvider>
   </AuthProvider>
)

export default Inventory
