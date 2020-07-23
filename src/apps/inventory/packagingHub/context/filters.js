import React, { useReducer, useContext } from 'react'

const FiltersContext = React.createContext()

const initialState = {
   refetchProduct: () => {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
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
