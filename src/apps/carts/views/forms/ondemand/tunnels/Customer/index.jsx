import React from 'react'
import { toast } from 'react-toastify'
import { useQuery } from '@apollo/react-hooks'
import {
   Flex,
   Tunnel,
   Tunnels,
   TunnelHeader,
   List,
   ListItem,
   ListSearch,
   ListHeader,
   ListOptions,
   useSingleList,
} from '@dailykit/ui'

import { useManual } from '../../state'
import { QUERIES } from '../../../../../graphql'
import { InlineLoader } from '../../../../../../../shared/components'

export const CustomerTunnel = ({ panel }) => {
   const { brand, dispatch } = useManual()
   const [tunnels, , closeTunnel] = panel
   const [search, setSearch] = React.useState('')
   const [customers, setCustomers] = React.useState([])
   const [isCustomersLoading, setIsCustomersLoading] = React.useState(true)
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

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel size="md">
            <TunnelHeader
               title="Select Customer"
               close={() => closeTunnel(1)}
               right={{
                  title: 'Save',
                  disabled: !current?.id,
                  action: () => {
                     dispatch({
                        type: 'SET_CUSTOMER',
                        payload: current,
                     })
                     closeTunnel(1)
                  },
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
                              title:
                                 current.customer?.platform_customer?.fullName,
                           }}
                        />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder="type what you’re looking for..."
                        />
                     )}
                     <ListHeader type="SSL2" label="Customers" />
                     <ListOptions
                        style={{ height: '320px', overflowY: 'auto' }}
                     >
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
         </Tunnel>
      </Tunnels>
   )
}
