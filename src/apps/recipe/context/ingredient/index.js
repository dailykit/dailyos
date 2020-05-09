import React from 'react'

export const IngredientContext = React.createContext()

export const state = {
   processingIndex: 0,
   sachetIndex: 0,
   realTime: {
      isPublished: true,
      isLive: false,
      station: undefined,
      labelTemplate: undefined,
      bulkItem: undefined,
      sachetItem: undefined,
      station: undefined,
      packaging: undefined,
      priority: 1,
      accuracy: 50,
   },
   plannedLot: {
      isPublished: true,
      isLive: false,
      station: undefined,
      labelTemplate: undefined,
      bulkItem: undefined,
      sachetItem: undefined,
      station: undefined,
      packaging: undefined,
      priority: 1,
      accuracy: 50,
   },
   currentMode: undefined,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'PROCESSING_INDEX': {
         return {
            ...state,
            processingIndex: payload,
            sachetIndex: 0,
         }
      }
      case 'SACHET_INDEX': {
         return {
            ...state,
            sachetIndex: payload,
         }
      }
      case 'MODE': {
         return {
            ...state,
            [payload.mode]: {
               ...state[payload.mode],
               [payload.name]: payload.value,
            },
         }
      }
      case 'CURRENT_MODE': {
         return {
            ...state,
            currentMode: payload,
         }
      }
      default:
         return state
   }
}
