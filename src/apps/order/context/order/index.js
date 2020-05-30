import React from 'react'

const Context = React.createContext()

const initialState = {
   selected_filter: null,
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      // Add Tab
      case 'SELECT_FILTER':
         return {
            ...state,
            selected_filter: payload,
         }
      default:
         return state
   }
}

export const OrderProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)

   return (
      <Context.Provider value={{ state, dispatch }}>
         {children}
      </Context.Provider>
   )
}

export const useTabs = () => {
   const { state, dispatch } = React.useContext(Context)

   return { state, dispatch }
}
