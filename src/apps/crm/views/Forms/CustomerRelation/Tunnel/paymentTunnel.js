import React from 'react'
import { Tunnels, Tunnel, TunnelHeader, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ALL_DATA } from '../../../../graphql'
import { PaymentCard } from '../../../../components'
import { TunnelHeaderContainer } from './styled'

const TunnelVision = props => {
   const { loading: listLoading, data: allCards } = useQuery(ALL_DATA, {
      variables: {
         keycloakId: props.id,
      },
   })
   if (listLoading) return <Loader />
   return (
      <Tunnels tunnels={props.tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title={`Payment Cards(${
                  allCards?.customer?.platform_customers[0]
                     ?.stripePaymentMethods?.length || 'N/A'
               })`}
               //   right={{ action: () => openTunnel(2), title: 'Next' }}
               close={() => props.closeTunnel(1)}
            />
            <TunnelHeaderContainer>
               {allCards?.customer?.platform_customers[0]?.stripePaymentMethods?.map(
                  card => {
                     return (
                        <PaymentCard
                           cardData={card}
                           billingAddDisplay="none"
                           margin="16px 80px"
                        />
                     )
                  }
               )}
            </TunnelHeaderContainer>
         </Tunnel>
      </Tunnels>
   )
}

export default TunnelVision
