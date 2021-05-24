import React from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   Flex,
   List,
   ListItem,
   ListSearch,
   ListHeader,
   ListOptions,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'

import { InlineLoader } from '../../../'
import { useManual } from '../../state'
import { logger } from '../../../../utils'
import { useTabs } from '../../../../providers'
import { QUERIES, MUTATIONS } from '../../graphql'

export const CustomerTunnel = () => {
   const { addTab } = useTabs()
   const [search, setSearch] = React.useState('')
   const [customers, setCustomers] = React.useState([])
   const { mode, brand, organization, tunnels, dispatch } = useManual()
   const [isCustomersLoading, setIsCustomersLoading] = React.useState(true)
   const [insert, { loading }] = useMutation(MUTATIONS.CART.INSERT, {
      onCompleted: ({ createCart = {} }) => {
         toast.success('Successfully created the cart.')
         if (createCart?.id) {
            const path = `/carts/${
               mode === 'subscription' ? 'subscription' : 'ondemand'
            }/${createCart?.id}`
            addTab(createCart?.id, path)
         }
      },
      onError: error => {
         logger(error)
         toast.error('Failed to create the cart.')
      },
   })
   useQuery(QUERIES.CUSTOMER.LIST, {
      variables: {
         where: { ...(brand?.id && { brandId: { _eq: brand?.id } }) },
      },
      onCompleted: ({ customers = [] }) => {
         if (customers.length > 0) {
            setCustomers(customers)
         }
         setIsCustomersLoading(false)
      },
      onError: () => {
         setIsCustomersLoading(false)
         toast.error('Failed to load customers list, please try again.')
      },
   })
   const [list, current, selectOption] = useSingleList(customers)

   const createCart = async () => {
      dispatch({
         type: 'SET_CUSTOMER',
         payload: current,
      })
      const customer = await processCustomer(current, organization)
      const cart = {}
      cart.source = mode
      cart.brandId = brand.id
      cart.isTest = customer.isTest
      cart.customerId = customer.id
      cart.customerKeycloakId = customer.keycloakId
      cart.customerInfo = {
         customerFirstName: customer.firstName,
         customerLastName: customer.lastName,
         customerEmail: customer.email,
         customerPhone: customer.phoneNumber,
      }
      await insert({ variables: { object: cart } })
   }

   return (
      <>
         <TunnelHeader
            title="Select Customer"
            close={() => tunnels.close(3)}
            right={{
               title: 'Save',
               action: createCart,
               isLoading: loading,
               disabled: !current?.id,
            }}
         />
         <Flex padding="16px" overflowY="auto" height="calc(100vh - 196px)">
            {isCustomersLoading ? (
               <InlineLoader />
            ) : (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem
                        type="SSL2"
                        content={{
                           description: current.customer?.email,
                           title: current.customer?.platform_customer?.fullName,
                        }}
                     />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder="type what you’re looking for..."
                     />
                  )}
                  <ListHeader type="SSL2" label="Customers" />
                  <ListOptions style={{ height: '320px', overflowY: 'auto' }}>
                     {list
                        .filter(option =>
                           option?.customer?.platform_customer?.fullName
                              .toLowerCase()
                              .includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="SSL2"
                              key={option.id}
                              isActive={option.id === current.id}
                              onClick={() => selectOption('id', option.id)}
                              content={{
                                 description: option.customer?.email,
                                 title:
                                    option.customer?.platform_customer
                                       ?.fullName,
                              }}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </Flex>
      </>
   )
}

const processCustomer = (user, organization) => {
   let customer = {}

   customer.brand_customerId = user.id
   customer.keycloakId = user.keycloakId
   customer.subscriptionPaymentMethodId = user.subscriptionPaymentMethodId

   customer.id = user.customer.id
   customer.email = user.customer.email
   customer.isTest = user.customer.isTest

   customer.firstName = user.customer.platform_customer?.firstName || ''
   customer.lastName = user.customer.platform_customer?.lastName || ''
   customer.fullName = user.customer.platform_customer?.fullName || ''
   customer.phoneNumber = user.customer.platform_customer?.phoneNumber || ''
   customer.stripeCustomerId =
      user.customer.platform_customer?.stripeCustomerId || ''

   if (
      organization.id &&
      organization?.stripeAccountType === 'standard' &&
      organization?.stripeAccountId
   ) {
      if (user.customer.platform_customer?.customerByClients.length > 0) {
         const [node = {}] =
            user.customer.platform_customer?.customerByClients || []
         if (node?.organizationStripeCustomerId) {
            customer.stripeCustomerId = node?.organizationStripeCustomerId
         }
      }
   }
   return customer
}
