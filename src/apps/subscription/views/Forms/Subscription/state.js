import React from 'react'

const PlanContext = React.createContext()

const initialState = {
   title: { id: null, title: '', defaultServing: { id: null } },
   serving: { selected: { size: '', isDefault: false } },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_TITLE':
         return {
            ...state,
            title: payload,
         }
      case 'SET_SERVING':
         return {
            ...state,
            serving: { selected: payload },
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
