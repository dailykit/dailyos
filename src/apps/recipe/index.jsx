import React from 'react'

import { AuthProvider, TabProvider } from './context'

const Recipe = () => (
   <AuthProvider>
      <TabProvider>
         <h1>Recipe App</h1>
      </TabProvider>
   </AuthProvider>
)

export default Recipe
