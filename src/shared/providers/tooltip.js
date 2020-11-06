import React from 'react'
import { isEmpty, has } from 'lodash'
import { Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'

import { TOOLTIPS_BY_APP } from '../graphql'

const TooltipContext = React.createContext()

const initialState = {
   tooltips: [],
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_TOOLTIPS':
         return { ...state, tooltips: payload }
      default:
         return state
   }
}

export const TooltipProvider = ({ app, children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const { loading } = useQuery(TOOLTIPS_BY_APP, {
      variables: { title: app },
      onCompleted: ({ app = {} }) => {
         if (!app?.showTooltip) return
         if (!isEmpty(app.tooltips)) {
            const tooltips = {}

            for (let tooltip of app.tooltips) {
               const { identifier, ...rest } = tooltip
               tooltips[identifier] = rest
            }
            dispatch({ type: 'SET_TOOLTIPS', payload: tooltips })
         }
      },
   })

   if (loading) return <Loader />
   return (
      <TooltipContext.Provider value={{ state, dispatch }}>
         {children}
      </TooltipContext.Provider>
   )
}

export const useTooltip = () => {
   const { state } = React.useContext(TooltipContext)

   const tooltip = React.useCallback(
      identifier => {
         console.log(identifier)
         if (has(state.tooltips, identifier)) {
            if (!state.tooltips[identifier].isActive) return {}
            return state.tooltips[identifier]
         }
         return {}
      },
      [state]
   )

   return {
      tooltip,
   }
}
