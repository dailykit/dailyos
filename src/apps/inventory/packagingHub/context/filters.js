import React, { useReducer, useContext } from 'react'

const FiltersContext = React.createContext()

const initialState = {
   length: null,
   width: null,
   isFDACompliant: null,
   isRecylable: null,
   isCompostable: null,
   isCompressable: null,
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SELECT_OPTION':
         const { value } = payload
         return { ...state, ...value }

      case 'CLEAR_OPTIONS':
         return {}

      case 'TOGGLE_FDACOMPLIANT':
         return { ...state, isFDACompliant: payload.value ? null : true }

      case 'TOGGLE_RECYLABLE':
         return { ...state, isRecylable: payload.value ? null : true }

      case 'TOGGLE_COMPOSTABLE':
         return { ...state, isCompostable: payload.value ? null : true }

      case 'TOGGLE_COMPRESSABLE':
         return { ...state, isCompressable: payload.value ? null : true }

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
