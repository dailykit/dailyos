import React from 'react'
import { Tunnels, Tunnel, TunnelHeader, Text } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ALL_DATA } from '../../../../graphql'
import { concatAddress } from '../../../../Utils'
import { TunnelHeaderContainer, CustomerAddress } from './styled'
import { logger } from '../../../../../../shared/utils'
import { InlineLoader } from '../../../../../../shared/components'
import { toast } from 'react-toastify'

const AddressTunnel = ({ id, tunnels, closeTunnel }) => {
   const { loading: listLoading, data: allAddress } = useQuery(ALL_DATA, {
      variables: {
         keycloakId: id,
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })
   if (listLoading) return <InlineLoader />

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
                           <Text as="title">{concatAddress(address)}</Text>
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
