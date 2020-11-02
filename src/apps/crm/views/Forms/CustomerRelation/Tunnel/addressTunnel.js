import React, { useContext } from 'react'
import { Tunnels, Tunnel, TunnelHeader, Text, Toggle } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ALL_DATA } from '../../../../graphql'
import { concatAddress } from '../../../../Utils'
import { TunnelHeaderContainer, CustomerAddress } from './styled'
import { logger } from '../../../../../../shared/utils'
import { Tooltip, InlineLoader } from '../../../../../../shared/components'
import { toast } from 'react-toastify'
import BrandContext from '../../../../context/Brand'

const AddressTunnel = ({ id, tunnels, closeTunnel }) => {
   const [context, setContext] = useContext(BrandContext)
   const {
      loading: listLoading,
      data: { brand: { brand_customers = [] } = {} } = {},
   } = useQuery(ALL_DATA, {
      variables: {
         keycloakId: id,
         brandId: context.brandId,
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
                  brand_customers[0]?.customer?.platform_customers[0]
                     ?.customerAddresses?.length || 0
               })`}
               close={() => closeTunnel(1)}
               tooltip={
                  <Tooltip identifier="customer_address_list_tunnelHeader" />
               }
            />
            <TunnelHeaderContainer>
               {brand_customers[0]?.customer?.platform_customers[0]?.customerAddresses?.map(
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
