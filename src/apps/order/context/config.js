import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { SETTINGS } from '../graphql'

const ConfigContext = React.createContext()

const initialState = {
   tunnel: { visible: false },
   scale: {
      weight_simulation: {
         app: 'order',
         type: 'scale',
         value: { value: false },
         identifier: 'weight simulation',
      },
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_SETTING':
         return { ...state, [payload.field]: payload.value }
      case 'TOGGLE_TUNNEL':
         return { ...state, tunnel: payload }
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
            const { __typename, ...rest } = settings[weighIndex]
            dispatch({
               type: 'SET_SETTING',
               payload: {
                  field: 'scale',
                  value: {
                     ...state.scale,
                     weight_simulation: rest,
                  },
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
