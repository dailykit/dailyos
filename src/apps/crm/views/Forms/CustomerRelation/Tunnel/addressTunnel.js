import React from 'react'
import { Tunnels, Tunnel, TunnelHeader, Loader, Text } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ALL_DATA } from '../../../../graphql'
import { addressStringify } from '../../../../Utils'
import { TunnelHeaderContainer, CustomerAddress } from './styled'

const AddressTunnel = ({ id, tunnels, closeTunnel }) => {
   const { loading: listLoading, data: allAddress } = useQuery(ALL_DATA, {
      variables: {
         keycloakId: id,
      },
   })
   if (listLoading) return <Loader />

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title={`Address Cards(${
                  allAddress?.customer?.platform_customers[0]?.customerAddresses
                     ?.length || 'N/A'
               })`}
               close={() => closeTunnel(1)}
            />
            <TunnelHeaderContainer>
               {allAddress?.customer?.platform_customers[0]?.customerAddresses?.map(
                  address => {
                     return (
                        <CustomerAddress key={address.id}>
                           <Text as="subtitle">Delivery Address</Text>
                           <Text as="title">{addressStringify(address)}</Text>
                        </CustomerAddress>
                     )
                  }
               )}
            </TunnelHeaderContainer>
         </Tunnel>
      </Tunnels>
   )
}

export default AddressTunnel
