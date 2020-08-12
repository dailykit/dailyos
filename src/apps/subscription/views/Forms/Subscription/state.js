import React from 'react'

const PlanContext = React.createContext()

const initialState = {
   title: { id: null },
   serving: { selected: { id: null } },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_TITLE':
         return {
            ...state,
            title: { id: payload.id, title: payload.title },
         }
      case 'SET_SERVING':
         return {
            ...state,
            serving: { selected: { id: payload.id } },
         }
      default:
         return state
   }
}

export const PlanProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   return (
      <PlanContext.Provider value={{ state, dispatch }}>
         {children}
      </PlanContext.Provider>
   )
}

export const usePlan = () => React.useContext(PlanContext)
