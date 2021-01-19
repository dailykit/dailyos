import React from 'react'

export const NotificationTypesContext = React.createContext()

export const state = {
   notificationTypes: undefined,
}

export const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'NOTIFICATIONTYPE': {
         return {
            ...state,
            notificationTypes: payload,
         }
      }
      default:
         return state
   }
}
