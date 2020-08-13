import React from 'react'
import { Tunnels, Tunnel, TunnelHeader, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ALL_DATA } from '../../../../graphql'
import { PaymentCard } from '../../../../components'
import { TunnelHeaderContainer } from './styled'

const TunnelVision = ({ id, tunnels, closeTunnel }) => {
   const { loading: listLoading, data: allCards } = useQuery(ALL_DATA, {
      variables: {
         keycloakId: id,
      },
   })
   if (listLoading) return <Loader />
   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title={`Payment Cards(${
                  allCards?.customer?.platform_customers[0]
                     ?.stripePaymentMethods?.length || 'N/A'
               })`}
               //   right={{ action: () => openTunnel(2), title: 'Next' }}
               close={() => closeTunnel(1)}
            />
            <TunnelHeaderContainer>
               {allCards?.customer?.platform_customers[0]?.stripePaymentMethods?.map(
                  card => {
                     return (
                        <PaymentCard
                           key={card.stripePaymentMethodId}
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
