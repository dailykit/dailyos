import React from 'react'

const PurchaseOrderContext = React.createContext()

const state = {
   id: null,
   status: '',
   supplierItem: {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_SUPPLIER_ITEM':
         return { ...state, supplierItem: payload }

      case 'SET_META':
         return { ...state, id: payload.id, status: payload.status }
      default:
         return state
   }
}

export { PurchaseOrderContext, state, reducers }
