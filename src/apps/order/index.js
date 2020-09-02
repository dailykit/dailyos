import React from 'react'

import {
   AuthProvider,
   TabProvider,
   OrderProvider,
   ConfigProvider,
} from './context'

import App from './App'

const Settings = () => (
   <AuthProvider>
      <ConfigProvider>
         <TabProvider>
            <OrderProvider>
               <App />
            </OrderProvider>
         </TabProvider>
      </ConfigProvider>
   </AuthProvider>
)

export default Settings
