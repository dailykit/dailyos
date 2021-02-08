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


const NotificationForm = ({typeid}) => {
   return (
      <>
         <div
            style={{
               height: '100vh',
            }}
         >
             <AddEmailAdresses typeid={typeid} />
        
         </div>
      </>
   )
}

export default NotificationForm
