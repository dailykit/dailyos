import React from 'react'

export const RecurrenceContext = React.createContext()

export const state = {
   fulfillmentTime: 'PRE ORDER',
   fulfillmentType: 'DELIVERY',
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'TIME': {
         return {
            ...state,
            fulfillmentTime: payload,
         }
      }
      case 'TYPE': {
         return {
            ...state,
            fulfillmentType: payload,
         }
      }
      default:
         return state
   }
}
