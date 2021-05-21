import React from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import {
   Text,
   Flex,
   Tunnel,
   Filler,
   Spacer,
   Tunnels,
   useTunnel,
   ButtonTile,
   TunnelHeader,
} from '@dailykit/ui'

import { useManual } from '../../state'
import { QUERIES } from '../../../../../graphql'
import AddPaymentTunnel from './AddPaymentTunnel'
import EmptyIllo from '../../../../../assets/svgs/EmptyIllo'
import { InlineLoader } from '../../../../../../../shared/components'

export const PaymentTunnel = ({ panel }) => {
   const [tunnels, , closeTunnel] = panel
   const { customer, dispatch } = useManual()
   const [payment, setPayment] = React.useState(null)
   const [addTunnels, openAddTunnel, closeAddTunnel] = useTunnel(1)
   const { loading, data: { paymentMethods = [] } = {}, refetch } = useQuery(
      QUERIES.CUSTOMER.PAYMENT_METHODS.LIST,
      {
         skip: !customer?.keycloakId,
         variables: {
            where: {
               keycloakId: { _eq: customer.keycloakId },
               customerByClient: {
                  clientId: {
                     _in: [
                        window._env_.REACT_APP_KEYCLOAK_REALM,
                        `${window._env_.REACT_APP_KEYCLOAK_REALM}-subscription`,
                     ],
                  },
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
                  title="Select Payment Method"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                     disabled: !payment?.id,
                     action: () => {
                        dispatch({ type: 'SET_PAYMENT', payload: payment })
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
                     text="Add Payment"
                     onClick={() => openAddTunnel(1)}
                  />
                  <Spacer size="16px" />
                  {loading ? (
                     <InlineLoader />
                  ) : (
                     <>
                        {paymentMethods.length === 0 ? (
                           <Filler
                              height="280px"
                              illustration={<EmptyIllo />}
                              message="No payment methods linked to this customer yet!"
                           />
                        ) : (
                           <ul>
                              {paymentMethods.map(node => (
                                 <Styles.Address
                                    key={node.id}
                                    onClick={() => setPayment(node)}
                                    className={
                                       node.id === payment?.id ? 'active' : ''
                                    }
                                 >
                                    <Text as="p">Name: {node.name}</Text>
                                    <Text as="p">
                                       Expiry: {node.expMonth}/{node.expYear}
                                    </Text>
                                    <Text as="p">Last 4: {node.last4}</Text>
                                 </Styles.Address>
                              ))}
                           </ul>
                        )}
                     </>
                  )}
               </Flex>
            </Tunnel>
         </Tunnels>
         <AddPaymentTunnel
            tunnels={addTunnels}
            onSave={() => refetch()}
            closeTunnel={closeAddTunnel}
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