import React from 'react'

import { AuthProvider } from './context'

import App from './App'

const SafetyApp = () => (
   <AuthProvider>
      <App />
   </AuthProvider>
)

export default SafetyApp
