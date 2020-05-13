import React from 'react'

const SachetOrderContext = React.createContext()

const state = {
   supplierItem: {},
   inputItemProcessing: {},
   outputSachet: {},
   sachetQuantity: 1,
   assignedUser: {},
   selectedStation: {},
   assignedDate: '',
   packaging: {},
   labelTemplates: [],
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_SUPPLIER_ITEM':
         return { ...state, supplierItem: payload }

      case 'ADD_INPUT_ITEM':
         return { ...state, inputItemProcessing: payload }

      case 'ADD_OUTPUT_SACHET':
         return { ...state, outputSachet: payload }
      case 'ADD_SACHET_QUANTITY':
         return { ...state, sachetQuantity: state.sachetQuantity + 1 }

      case 'REMOVE_SACHET_QUANTITY':
         return { ...state, sachetQuantity: state.sachetQuantity - 1 }

      case 'SELECT_USER':
         return { ...state, assignedUser: payload }

      case 'ADD_STATION':
         return { ...state, selectedStation: payload }

      case 'SET_ASSIGNED_DATE':
         return { ...state, assignedDate: payload }

      case 'SELECT_PACKAGING':
         return { ...state, packaging: payload }

      case 'SELECT_TEMPLATE_OPTIONS':
         return { ...state, labelTemplates: payload }
      default:
         return state
   }
}

export { SachetOrderContext, state, reducers }
