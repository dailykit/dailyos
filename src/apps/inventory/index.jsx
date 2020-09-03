import React from 'react'

import { AuthProvider } from './context'

import App from './App'

const Inventory = () => {
   if (process.env.NODE_ENV === 'development') return <App />

   return (
      <AuthProvider>
         <App />
      </AuthProvider>
   )
}

export default Inventory
