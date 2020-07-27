import React, { useReducer, useContext } from 'react'

const FiltersContext = React.createContext()

const initialState = {
   length: null,
   width: null,
   isFDACompliant: null,
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SELECT_OPTION':
         const { value } = payload
         return { ...state, ...value }

      case 'CLEAR_OPTIONS':
         return {}

      case 'TOGGLE_FDACOMPLIANT':
         return { ...state, isFDACompliant: !state.isFDACompliant }

      default:
         return state
   }
}

export default function FiltersProvider({ children }) {
   const [state, dispatch] = useReducer(reducers, initialState)

   return (
      <FiltersContext.Provider
         value={{
            filters: state,
            dispatch,
         }}
      >
         {children}
      </FiltersContext.Provider>
   )
}

export const useFilters = () => useContext(FiltersContext)
