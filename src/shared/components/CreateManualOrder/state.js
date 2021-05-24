import React from 'react'
import { toast } from 'react-toastify'
import { useTunnel } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'

import { InlineLoader } from '../'
import { QUERIES } from './graphql'
import { logger } from '../../utils'

const Context = React.createContext()

const initial = {
   mode: '',
   brand: { id: null },
   customer: { id: null },
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
      case 'SET_CUSTOMER': {
         let customer = {}

         customer.brand_customerId = payload.id
         customer.keycloakId = payload.keycloakId
         customer.subscriptionPaymentMethodId =
            payload.subscriptionPaymentMethodId

         customer.id = payload.customer.id
         customer.email = payload.customer.email

         customer.firstName =
            payload.customer.platform_customer?.firstName || ''
         customer.lastName = payload.customer.platform_customer?.lastName || ''
         customer.fullName = payload.customer.platform_customer?.fullName || ''
         customer.phoneNumber =
            payload.customer.platform_customer?.phoneNumber || ''
         customer.stripeCustomerId =
            payload.customer.platform_customer?.stripeCustomerId || ''

         if (
            state.organization.id &&
            state.organization?.stripeAccountType === 'standard' &&
            state.organization?.stripeAccountId
         ) {
            if (
               payload.customer.platform_customer?.customerByClients.length > 0
            ) {
               const [node = {}] =
                  payload.customer.platform_customer?.customerByClients || []
               if (node?.organizationStripeCustomerId) {
                  customer.stripeCustomerId = node?.organizationStripeCustomerId
               }
            }
         }

         return {
            ...state,
            customer,
         }
      }
      case 'SET_ORGANIZATION':
         return {
            ...state,
            organization: payload,
         }
      default:
         return state
   }
}

export const Provider = ({ isModeTunnelOpen, children }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(3)
   const [state, dispatch] = React.useReducer(reducers, initial)
   const [organizationLoading, setOrganizationLoading] = React.useState(true)

   React.useEffect(() => {
      if (isModeTunnelOpen) {
         openTunnel(1)
      } else {
      }
   }, [isModeTunnelOpen])

   useQuery(QUERIES.ORGANIZATION, {
      onCompleted: ({ organizations = [] }) => {
         if (organizations.length > 0) {
            const [organization] = organizations
            dispatch({ type: 'SET_ORGANIZATION', payload: organization })
         }
         setOrganizationLoading(false)
      },
      onError: error => {
         logger(error)
         setOrganizationLoading(false)
         toast.error('Failed to fetch organization details!')
      },
   })

   if (organizationLoading) return <InlineLoader />
   return (
      <Context.Provider
         value={{
            dispatch,
            ...state,
            tunnels: { list: tunnels, open: openTunnel, close: closeTunnel },
         }}
      >
         {children}
      </Context.Provider>
   )
}

export const useManual = () => React.useContext(Context)
