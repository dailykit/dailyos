import React from 'react'

export const ProductContext = React.createContext()

export const initialState = {
   productOptionType: '',
   optionId: null,
}

export const reducer = (state = initialState, { type, payload }) => {
   switch (type) {
      case 'PRODUCT_OPTION_TYPE': {
         return {
            ...state,
            productOptionType: payload,
         }
      }
      case 'OPTION': {
         return {
            ...state,
            optionId: payload,
         }
      }
      default:
         return state
   }
}

export const ProductProvider = ({ children }) => {
   const [productState, productDispatch] = React.useReducer(
      reducer,
      initialState
   )

   return (
      <ProductContext.Provider value={{ productState, productDispatch }}>
         {children}
      </ProductContext.Provider>
   )
}
