import React from 'react'

import { AuthProvider } from './context'

import App from './App'

const OnlineStore = () => (
   <AuthProvider>
      <App />
   </AuthProvider>
)

export default OnlineStore
