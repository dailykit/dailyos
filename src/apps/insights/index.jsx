import React from 'react'

import { TabProvider } from './context'

import App from './App'

const Insights = () => (
   <TabProvider>
      <App />
   </TabProvider>
)

export default Insights
