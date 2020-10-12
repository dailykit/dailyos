import React from 'react'

export const SimpleProductContext = React.createContext()

export const state = {
   meta: {
      modifierProductType: 'inventoryProduct',
   },
   recommendationProductType: 'inventory',
   recommendationType: '',
   optionId: undefined,
   edit: undefined,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'EDIT': {
         return {
            ...state,
            edit: payload,
         }
      }
      case 'RECOMMENDATION_TYPE': {
         return {
            ...state,
            recommendationType: payload.recommendationType,
         }
      }
      case 'RECOMMENDATION_PRODUCT_TYPE': {
         return {
            ...state,
            recommendationProductType: payload.recommendationProductType,
         }
      }
      case 'OPTION_ID': {
         return {
            ...state,
            optionId: payload.optionId,
         }
      }
      case 'META': {
         return {
            ...state,
            meta: {
               ...state.meta,
               [payload.name]: payload.value,
            },
         }
      }
      default:
         return state
   }
}
