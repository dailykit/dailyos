import React from 'react'

const MenuContext = React.createContext()

const initialState = {
   date: null,
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_DATE':
         return { ...state, date: payload }
      default:
         return state
   }
}

export const MenuProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)

   return (
      <MenuContext.Provider value={{ state, dispatch }}>
         {children}
      </MenuContext.Provider>
   )
}

export const useMenu = () => React.useContext(MenuContext)
