import React from 'react'

export const InventoryProductContext = React.createContext()

export const initialState = {
   meta: {
      itemType: 'inventory',
   },
   recommendationProductType: 'inventory',
   recommendationType: '',
   updating: false,
   option: undefined,
}

export const reducers = (state = initialState, { type, payload }) => {
   switch (type) {
      case 'UPDATING': {
         return {
            ...state,
            updating: payload,
         }
      }
      case 'OPTION': {
         return {
            ...state,
            option: payload,
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
