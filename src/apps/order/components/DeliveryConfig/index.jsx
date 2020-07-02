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
import {
   Wrapper,
   StyledList,
   StyledDeliveryCard,
   DeliveryStates,
} from './styled'
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

   const viewInfo = (e, id) => {
      e.stopPropagation()
      setService(id)
      openTunnel(1)
   }

   const handleSelection = (e, service) => {
      dispatch({
         type: 'DELIVERY_PANEL',
         payload: {
            orderId: delivery_config.orderId,
            selectedDeliveryService: {
               logo: service.logo,
               name: service.companyName,
               ...(service.isThirdParty && { id: service.partnershipId }),
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
               <DeliveryDetails details={order} />
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
                                 onClick={e =>
                                    viewInfo(e, service.partnershipId)
                                 }
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

const DeliveryDetails = ({ details }) => {
   const [isLoading, setIsLoading] = React.useState(true)
   const [deliveryInfo, setDeliveryInfo] = React.useState(null)
   const [order, setOrder] = React.useState(null)

   React.useEffect(() => {
      const { deliveryInfo, ...rest } = details
      setOrder(rest)
      setDeliveryInfo(deliveryInfo)
      setIsLoading(false)
   }, [details])

   if (isLoading) return <InlineLoader />
   return (
      <main>
         <Text as="title">Delivery By</Text>
         <Avatar
            withName
            title={deliveryInfo.deliveryCompany.name}
            url={deliveryInfo.deliveryCompany.logo}
         />
         <section>
            <Text as="title">Delivery Status</Text>
            <DeliveryStates
               status={{
                  request: deliveryInfo.deliveryRequest.status.value,
                  assignment: deliveryInfo.assigned.status.value,
                  pickup: deliveryInfo.pickup.status.value,
                  dropoff: deliveryInfo.dropoff.status.value,
               }}
            >
               <DeliveryState
                  title="Delivery Request"
                  value={deliveryInfo.deliveryRequest.status.value}
               />
               <DeliveryState
                  title="Driver Assigned"
                  value={deliveryInfo.assigned.status.value}
               />
               <DeliveryState
                  title="Pick Up"
                  value={deliveryInfo.pickup.status.value}
               />
               <DeliveryState
                  title="Drop Off"
                  value={deliveryInfo.dropoff.status.value}
               />
               <DeliveryState
                  title="Delivered"
                  value={
                     deliveryInfo.dropoff.status.value === 'SUCCEEDED'
                        ? 'SUCCEEDED'
                        : 'WAITING'
                  }
               />
            </DeliveryStates>
         </section>
      </main>
   )
}

const STATUS = {
   WAITING: 'Waiting',
   IN_PROGRESS: 'In Progress',
   SUCCEEDED: 'Completed',
   CANCELLED: 'Cancelled',
}

const DeliveryState = ({ title, value }) => {
   return (
      <StyledDeliveryCard>
         <span>{title}</span>
         <span>{STATUS[value]}</span>
      </StyledDeliveryCard>
   )
}
