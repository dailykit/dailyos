import React, { useReducer } from 'react'
import AddEmailAdresses from './AddEmail/index'
import {
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   Form,
   Spacer,
   Text,
} from '@dailykit/ui'

const selectUsers = () => {
   return <>Select Users</> 
}

const NotificationForm = ({typeid}) => {
   return (
      <>
         <h1> Notification Form</h1>
         <h1>{typeid}</h1>
         <div
            style={{
               height: 'calc(100vh - 65px)',
            }}
         ></div>
      </>
   )
}

export default NotificationForm
