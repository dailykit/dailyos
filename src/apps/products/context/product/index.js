import React from 'react'

export const ProductContext = React.createContext()

export const initialState = {
   productOptionType: '',
}

export const reducer = (state = initialState, { type, payload }) => {
   switch (type) {
      case 'PRODUCT_OPTION_TYPE': {
         return {
            ...state,
            productOptionType: payload,
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
