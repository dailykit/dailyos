import React from 'react'

const PlanContext = React.createContext()

const initialState = {
   title: { id: null, title: '', defaultServing: { id: null } },
   serving: { size: '', isDefault: false },
   item: { count: '', price: '' },
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
            serving: { ...state.serving, ...payload },
         }
      case 'SET_ITEM':
         return {
            ...state,
            item: { ...state.item, ...payload },
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