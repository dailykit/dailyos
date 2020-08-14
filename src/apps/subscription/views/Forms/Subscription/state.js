import React from 'react'

const PlanContext = React.createContext()

const initialState = {
   title: {
      id: null,
      title: '',
      isActive: false,
      defaultServing: { id: null },
   },
   serving: { isActive: true, size: '', isDefault: false },
   item: { count: '', price: '' },
   subscription: { id: null },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_TITLE':
         return {
            ...state,
            title: { ...state.title, ...payload },
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
      case 'SET_SUBSCRIPTION': {
         return {
            ...state,
            subscription: payload,
         }
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
