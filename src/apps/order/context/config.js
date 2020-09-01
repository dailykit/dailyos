import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { SETTINGS } from '../graphql'

const ConfigContext = React.createContext()

const initialState = {
   weight_simultation: {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_SETTING':
         return { ...state, [payload.field]: payload.value }
      default:
         return state
   }
}

export const ConfigProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   useSubscription(SETTINGS, {
      onSubscriptionData: ({
         subscriptionData: { data: { settings = [] } = {} } = {},
      }) => {
         const weighIndex = settings.findIndex(
            setting => setting.identifier === 'weight simulation'
         )
         if (weighIndex !== -1) {
            dispatch({
               type: 'SET_SETTING',
               payload: {
                  field: 'weight_simultation',
                  value: settings[weighIndex],
               },
            })
         }
      },
   })

   return (
      <ConfigContext.Provider value={{ state, dispatch, methods: {} }}>
         {children}
      </ConfigContext.Provider>
   )
}

export const useConfig = () => React.useContext(ConfigContext)
