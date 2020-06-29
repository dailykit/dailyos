import React from 'react'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import {
   Text,
   Avatar,
   IconButton,
   useTunnel,
   Tunnels,
   Tunnel,
   TunnelHeader,
} from '@dailykit/ui'

import { useOrder } from '../../context'
import { DELIVERY_SERVICES, ORDER_DELIVERY_INFO } from '../../graphql'
import { Wrapper, StyledList } from './styled'
import { ServiceInfo } from '../ServiceInfo'
import { InfoIcon } from '../../../../shared/assets/icons'
import { InlineLoader } from '../../../../shared/components'

export const DeliveryConfig = () => {
   const {
      dispatch,
      state: { delivery_config },
   } = useOrder()
   const [service, setService] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { loading: loadingOrder, data: { order = {} } = {} } = useSubscription(
      ORDER_DELIVERY_INFO,
      {
         variables: { id: delivery_config.orderId },
      }
   )
   const {
      loading: loadingServices,
      data: { deliveryServices = [] } = {},
   } = useQuery(DELIVERY_SERVICES)

   const viewInfo = (e, service) => {
      e.stopPropagation()
      setService(service)
      openTunnel(1)
   }

   const handleSelection = (e, service) => {
      dispatch({
         type: 'DELIVERY_PANEL',
         payload: {
            orderId: delivery_config.orderId,
            selectedDeliveryService: {
               logo: service.logo,
               id: service.details.id,
               name: service.companyName,
            },
         },
      })
   }

   if (loadingOrder)
      return (
         <Wrapper>
            <InlineLoader />
         </Wrapper>
      )
   return (
      <Wrapper>
         {order.deliveryInfo?.deliveryCompany?.name ? (
            <>
               <section>
                  <Text as="title">Delivery By</Text>
                  <Avatar
                     withName
                     title={order.deliveryInfo.deliveryCompany.name}
                     url={order.deliveryInfo.deliveryCompany.logo}
                  />
               </section>
            </>
         ) : (
            <>
               <section>
                  <Text as="title">Available Delivery Partners</Text>
                  {loadingServices && <InlineLoader />}
                  <StyledList>
                     {deliveryServices.map(service => (
                        <li key={service.id}>
                           <section onChange={e => handleSelection(e, service)}>
                              <input type="radio" name="service" />
                              <Avatar
                                 withName
                                 title={service.companyName}
                                 url={service.logo}
                              />
                           </section>
                           {service.isThirdParty && (
                              <IconButton
                                 type="outline"
                                 onClick={e => viewInfo(e, service)}
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
            </>
         )}
      </Wrapper>
   )
}
