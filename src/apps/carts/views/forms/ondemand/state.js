import React from 'react'
import { toast } from 'react-toastify'
import { useTunnel } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'

import {
   BrandTunnel,
   CustomerTunnel,
   AddressTunnel,
   PaymentTunnel,
} from './tunnels'
import { QUERIES } from '../../../graphql'
import { InlineLoader } from '../../../../../shared/components'

const Context = React.createContext()

const initial = {
   brand: { id: null },
   customer: { id: null },
   address: { id: null },
   paymentMethod: { id: null },
   organization: { id: null },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
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
      case 'SET_ADDRESS':
         return {
            ...state,
            address: payload,
         }
      case 'SET_PAYMENT':
         return {
            ...state,
            paymentMethod: payload,
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

export const ManualProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initial)
   const [organizationLoading, setOrganizationLoading] = React.useState(true)
   const brandTunnels = useTunnel(1)
   const customerTunnels = useTunnel(1)
   const addressTunnels = useTunnel(1)
   const paymentTunnels = useTunnel(1)
   useQuery(QUERIES.ORGANIZATION, {
      onCompleted: ({ organizations = [] }) => {
         if (organizations.length > 0) {
            const [organization] = organizations
            dispatch({ type: 'SET_ORGANIZATION', payload: organization })
         }
         setOrganizationLoading(false)
      },
      onError: () => {
         setOrganizationLoading(false)
         toast.error('Failed to fetch organization details!')
      },
   })

   if (organizationLoading) return <InlineLoader />
   return (
      <Context.Provider
         value={{
            state,
            dispatch,
            brand: state.brand,
            address: state.address,
            customer: state.customer,
            organization: state.organization,
            paymentMethod: state.paymentMethod,
            tunnels: {
               brand: brandTunnels,
               customer: customerTunnels,
               address: addressTunnels,
               payment: paymentTunnels,
            },
         }}
      >
         {children}
         <BrandTunnel panel={brandTunnels} />
         <CustomerTunnel panel={customerTunnels} />
         <AddressTunnel panel={addressTunnels} />
         <PaymentTunnel panel={paymentTunnels} />
      </Context.Provider>
   )
}

export const useManual = () => React.useContext(Context)
