import React from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import {
   Text,
   Flex,
   Tunnel,
   Filler,
   Tunnels,
   ButtonTile,
   TunnelHeader,
   Spacer,
   useTunnel,
} from '@dailykit/ui'

import { useManual } from '../../state'
import { QUERIES } from '../../../../graphql'
import EmptyIllo from '../../../../assets/svgs/Empty'
import { parseAddress } from '../../../../../../shared/utils'
import {
   InlineLoader,
   AddressTunnel as AddTunnel,
} from '../../../../../../shared/components'

export const AddressTunnel = ({ panel }) => {
   const [tunnels, , closeTunnel] = panel
   const [addTunnels, openAddTunnel, closeAddTunnel] = useTunnel(1)
   const { customer, state, dispatch } = useManual()
   const [address, setAddress] = React.useState(null)
   const { loading, data: { addresses = [] } = {}, refetch } = useQuery(
      QUERIES.MANUAL.CUSTOMER.ADDRESS.LIST,
      {
         skip: !customer?.id,
         variables: {
            where: {
               keycloakId: { _eq: customer.keycloakId },
               clientId: {
                  _eq: `${window._env_.REACT_APP_KEYCLOAK_REALM}${
                     state.mode === 'subscription' ? '-subscription' : ''
                  }`,
               },
            },
         },
         onError: () => {
            toast.error('Failed to load addresses, please try again.')
         },
      }
   )

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel size="md">
               <TunnelHeader
                  title="Select Address"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                     disabled: !address?.id,
                     action: () => {
                        dispatch({ type: 'SET_ADDRESS', payload: address })
                        closeTunnel(1)
                     },
                  }}
               />
               <Flex
                  padding="16px"
                  overflowY="auto"
                  height="calc(100vh - 196px)"
               >
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text="Add Address"
                     onClick={() => openAddTunnel(1)}
                  />
                  <Spacer size="16px" />
                  {loading ? (
                     <InlineLoader />
                  ) : (
                     <>
                        {addresses.length === 0 ? (
                           <Filler
                              height="280px"
                              illustration={<EmptyIllo />}
                              message="No addressess linked to this customer yet!"
                           />
                        ) : (
                           <ul>
                              {addresses.map(node => (
                                 <Styles.Address
                                    key={node.id}
                                    onClick={() => setAddress(node)}
                                    className={
                                       node.id === address?.id ? 'active' : ''
                                    }
                                 >
                                    <Text as="p">{parseAddress(node)}</Text>
                                 </Styles.Address>
                              ))}
                           </ul>
                        )}
                     </>
                  )}
               </Flex>
            </Tunnel>
         </Tunnels>
         <AddTunnel
            tunnels={addTunnels}
            onSave={() => refetch()}
            closeTunnel={closeAddTunnel}
            keycloakId={customer?.keycloakId}
            clientId={`${window._env_.REACT_APP_KEYCLOAK_REALM}${
               state.mode === 'subscription' ? '-subscription' : ''
            }`}
         />
      </>
   )
}

const Styles = {
   Address: styled.li`
      padding: 14px;
      list-style: none;
      border-radius: 2px;
      border: 1px solid #ebebeb;
      + li {
         margin-top: 14px;
      }
      &.active {
         border-color: #5d41db;
      }
   `,
}
