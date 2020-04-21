import React from 'react'

const BulkOrderContext = React.createContext()

const state = {
   supplierItem: {},
   outputItemProcessing: {},
   selectedStation: {},
   assignedUser: {}
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_SUPPLIER_ITEM':
         return { ...state, supplierItem: payload }

      case 'ADD_OUTPUT_ITEM':
         return { ...state, outputItemProcessing: payload }

      case 'SET_NEW_YIELD_PERCENT':
         return {
            ...state,
            outputItemProcessing: {
               ...state.outputItemProcessing,
               yield: payload
            }
         }

      case 'SET_OUTPUT_QUANTITY':
         return {
            ...state,
            outputItemProcessing: {
               ...state.outputItemProcessing,
               outputQuantity: payload
            }
         }

      case 'SELECT_USER':
         return { ...state, assignedUser: payload }

      case 'ADD_STATION':
         return { ...state, selectedStation: payload }
      default:
         return state
   }
}

export { BulkOrderContext, state, reducers }
