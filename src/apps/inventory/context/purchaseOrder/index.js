import React from 'react'

const PurchaseOrderContext = React.createContext()

const state = {
   supplierItem: {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_SUPPLIER_ITEM':
         return { ...state, supplierItem: payload }
      default:
         return state
   }
}

export { PurchaseOrderContext, state, reducers }
