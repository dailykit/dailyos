import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
   Text,
   Avatar,
   IconButton,
   useTunnel,
   Tunnels,
   Tunnel,
   TunnelHeader,
} from '@dailykit/ui'

import { DELIVERY_SERVICES } from '../../graphql'
import { Wrapper, StyledList } from './styled'
import { ServiceInfo } from '../ServiceInfo'
import { InfoIcon } from '../../../../shared/assets/icons'

export const DeliveryConfig = () => {
   const [service, setService] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { loading, data: { deliveryServices = [] } = {} } = useQuery(
      DELIVERY_SERVICES
   )

   const viewInfo = (e, service) => {
      e.stopPropagation()
      setService(service)
      openTunnel(1)
   }

   return (
      <Wrapper>
         <section>
            <Text as="title">Available Delivery Partners</Text>
            <StyledList>
               {loading && <span>Loading...</span>}
               {deliveryServices.map(service => (
                  <li key={service.id}>
                     <Avatar
                        withName
                        title={service.companyName}
                        url={service.logo}
                     />
                     {service.isThirdParty && (
                        <IconButton
                           type="outline"
                           onClick={e => viewInfo(e, service.partnershipId)}
                        >
                           <InfoIcon />
                        </IconButton>
                     )}
                  </li>
               ))}
            </StyledList>
         </section>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer="1" size="sm">
               <TunnelHeader
                  title="Delivery Partner Information"
                  close={() => closeTunnel(1)}
               />
               <ServiceInfo id={service} />
            </Tunnel>
         </Tunnels>
      </Wrapper>
   )
}
