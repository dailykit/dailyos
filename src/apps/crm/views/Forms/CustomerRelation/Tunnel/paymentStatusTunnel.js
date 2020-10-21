import React from 'react'
import { Tunnels, Tunnel, TunnelHeader, Text } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useTabs } from '../../../../context'
import { STATUS } from '../../../../graphql'
import { TunnelHeaderContainer, StyledDiv } from './styled'
import { logger } from '../../../../../../shared/utils'
import { InlineLoader } from '../../../../../../shared/components'
import { toast } from 'react-toastify'

const PaymentStatus = ({ tunnels, closeTunnel }) => {
   const { tab } = useTabs()
   const { loading: listLoading, data: statusData } = useQuery(STATUS, {
      variables: {
         oid: tab.data.oid,
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
            <TunnelHeader title="Payment Status" close={() => closeTunnel(1)} />
            <TunnelHeaderContainer>
               <StyledDiv>
                  <Text as="h2">
                     {`Transaction Id: ${
                        statusData?.order?.transactionId || 'N/A'
                     }`}
                  </Text>
               </StyledDiv>
               <StyledDiv>
                  <Text as="h2">
                     {`Status: ${statusData?.order?.paymentStatus || 'N/A'}`}
                  </Text>
               </StyledDiv>
            </TunnelHeaderContainer>
         </Tunnel>
      </Tunnels>
   )
}

export default PaymentStatus
