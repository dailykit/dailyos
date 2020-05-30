import React from 'react'

const SupplierContext = React.createContext()

const state = {
   name: '',
   address: {},
   contact: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '',
      phoneNumber: '',
   },
   terms: { paymentTerms: '', shippingTerms: '' },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_NAME':
         return { ...state, name: payload }

      case 'ADD_ADDRESS':
         return { ...state, address: { ...payload } }

      case 'ADD_CONTACT':
         return { ...state, contact: { ...payload } }

      case 'SET_SHIPPING_TERMS':
         return { ...state, terms: { ...state.terms, shippingTerms: payload } }

      case 'SET_PAYMENT_TERMS':
         return { ...state, terms: { ...state.terms, paymentTerms: payload } }

      case 'SET_ID':
         return { ...state, id: payload }

      default:
         return state
   }
}

export { SupplierContext, state, reducers }
