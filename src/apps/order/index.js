import React from 'react'

import {
   AuthProvider,
   TabProvider,
   OrderProvider,
   ConfigProvider,
   AccessProvider,
} from './context'

import App from './App'

const Settings = () => (
   <AuthProvider>
      <AccessProvider>
         <ConfigProvider>
            <TabProvider>
               <OrderProvider>
                  <App />
               </OrderProvider>
            </TabProvider>
         </ConfigProvider>
      </AccessProvider>
   </AuthProvider>
)

export default Settings
