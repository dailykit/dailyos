import React from 'react'

import { AuthProvider } from './context/auth'

import App from './App'

const CRM = () => (
   <AuthProvider>
      <App />
   </AuthProvider>
)

export default CRM
