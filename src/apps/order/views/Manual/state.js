import React from 'react'
import { Filler, useTunnel } from '@dailykit/ui'

import { BrandTunnel } from './tunnels'
import { InlineLoader } from '../../../../shared/components'

const Context = React.createContext()

const initial = {
   mode: '',
   brand: { id: null },
   customer: { id: null },
   address: { id: null },
   paymentMethod: { id: null },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_MODE':
         return { ...state, mode: payload }
      case 'SET_BRAND':
         return {
            ...state,
            brand: {
               id: payload.id,
               title: payload?.title || '',
               domain: payload?.domain || 'N/A',
            },
         }
      default:
         return state
   }
}

export const ManualProvider = ({ children }) => {
   const [isModeLoading, setIsModeLoading] = React.useState(true)
   const [state, dispatch] = React.useReducer(reducers, initial)
   const brandTunnels = useTunnel(1)

   React.useEffect(() => {
      const mode = new URL(window.location.href).searchParams.get('mode')
      if (mode && mode.trim()) {
         console.log(mode)
         dispatch({ type: 'SET_MODE', payload: mode })
      }
      setIsModeLoading(false)
   }, [])

   if (isModeLoading) return <InlineLoader />
   if (!state.mode)
      return (
         <Filler message="Please select either ondemand store or subscription store." />
      )
   return (
      <Context.Provider
         value={{
            state,
            dispatch,
            brand: state.brand,
            address: state.address,
            customer: state.customer,
            paymentMethod: state.paymentMethod,
            tunnels: { brand: brandTunnels },
         }}
      >
         {children}
         <BrandTunnel panel={brandTunnels} />
      </Context.Provider>
   )
}

export const useManual = () => React.useContext(Context)
