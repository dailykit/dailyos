import React from 'react'
import { Tunnels, Tunnel, TunnelHeader, Loader, Text } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ALL_DATA } from '../../../../graphql'
import { ConcatAddress } from '../../Utils'
import { TunnelHeaderContainer, CustomerAddress } from './styled'

const AddressTunnel = props => {
   const { loading: listLoading, data: allAddress } = useQuery(ALL_DATA, {
      variables: {
         keycloakId: props.id,
      },
   })
   if (listLoading) return <Loader />

   return (
      <Tunnels tunnels={props.tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title={`Address Cards(${
                  allAddress?.customer?.platform_customers[0]?.customerAddresses
                     ?.length || 'N/A'
               })`}
               //   right={{ action: () => openTunnel(2), title: 'Next' }}
               close={() => props.closeTunnel(1)}
            />
            <TunnelHeaderContainer>
               {allAddress?.customer?.platform_customers[0]?.customerAddresses?.map(
                  address => {
                     return (
                        <CustomerAddress>
                           <Text as="subtitle">Delivery Address</Text>
                           <Text as="title">{ConcatAddress(address)}</Text>
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
