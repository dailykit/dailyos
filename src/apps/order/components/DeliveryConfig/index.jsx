import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
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
   StyledDeliveryBy,
   StyledTag,
   StyledTrackingButton,
} from './styled'
import { normalizeAddress, formatDate } from '../../utils'
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
   const [map, setMap] = React.useState(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [coordinates, setCoordinates] = React.useState({
      driver: null,
      customer: null,
      organization: null,
   })
   const [deliveryInfo, setDeliveryInfo] = React.useState(null)
   const [order, setOrder] = React.useState(null)

   React.useEffect(() => {
      const { deliveryInfo, ...rest } = details
      setOrder(rest)
      setDeliveryInfo(deliveryInfo)
      setCoordinates({
         driver: {
            lat: deliveryInfo.tracking.location.latitude,
            lng: deliveryInfo.tracking.location.longitude,
         },
         customer: {
            lat: deliveryInfo.dropoff.dropoffInfo.customerAddress.latitude,
            lng: deliveryInfo.dropoff.dropoffInfo.customerAddress.longitude,
         },
         organization: {
            lat: deliveryInfo.pickup.pickupInfo.organizationAddress.latitude,
            lng: deliveryInfo.pickup.pickupInfo.organizationAddress.longitude,
         },
      })
      setIsLoading(false)
   }, [details])

   const onLoad = React.useCallback(function callback(map) {
      const bounds = new window.google.maps.LatLngBounds()
      map.fitBounds(bounds)
      setMap(map)
   }, [])

   const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
   }, [])

   const containerStyle = {
      width: '100%',
      height: '400px',
   }

   const trackDelivery = () => {
      window.open(deliveryInfo.tracking.code.url, '__blank')
   }

   if (isLoading) return <InlineLoader />
   return (
      <main>
         <StyledDeliveryBy>
            <div
               style={{
                  display: 'flex',
                  alignItems: 'center',
               }}
            >
               <Text as="title">Delivery Status</Text>
               <StyledTrackingButton onClick={() => trackDelivery()}>
                  Track
               </StyledTrackingButton>
            </div>
            <Avatar
               withName
               title={deliveryInfo.deliveryCompany.name}
               url={deliveryInfo.deliveryCompany.logo}
            />
         </StyledDeliveryBy>
         <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
            <GoogleMap
               zoom={15}
               onLoad={onLoad}
               onUnmount={onUnmount}
               clickableIcons={false}
               center={coordinates.organization}
               mapContainerStyle={containerStyle}
            >
               <Marker
                  position={coordinates.organization}
                  icon="https://www.dailykit.org/hubfs/official_dailykit_website/img/anims/output-onlinepngtools.png"
               />
               <Marker
                  position={coordinates.customer}
                  icon="https://www.dailykit.org/hubfs/official_dailykit_website/img/anims/output-onlinepngtools.png"
               />
               <Marker
                  position={coordinates.driver}
                  icon="https://www.dailykit.org/hubfs/official_dailykit_website/img/anims/marker.png"
               />
            </GoogleMap>
         </LoadScript>
         <section>
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
                  time={deliveryInfo.deliveryRequest.status.timeStamp}
               />
               <DeliveryState
                  title="Driver Assigned"
                  value={deliveryInfo.assigned.status.value}
                  time={deliveryInfo.assigned.status.timeStamp}
               >
                  <div
                     style={{
                        display: 'flex',
                        alignItems: 'center',
                     }}
                  >
                     <Avatar
                        withName
                        url={deliveryInfo.assigned.driverInfo.driverPicture}
                        title={`${deliveryInfo.assigned.driverInfo.driverFirstName} ${deliveryInfo.assigned.driverInfo.driverLastName}`}
                     />
                     &nbsp;&middot;&nbsp;
                     {deliveryInfo.assigned.driverInfo.driverPhone || 'N/A'}
                  </div>
               </DeliveryState>
               <DeliveryState
                  title="Pick Up"
                  value={deliveryInfo.pickup.status.value}
                  time={deliveryInfo.pickup.status.timeStamp}
               >
                  <div
                     style={{
                        display: 'flex',
                        alignItems: 'center',
                     }}
                  >
                     <Avatar
                        withName
                        title={deliveryInfo.pickup.pickupInfo.organizationName}
                     />
                     &nbsp;&middot;&nbsp;
                     {deliveryInfo.pickup.pickupInfo.organizationPhone || 'N/A'}
                  </div>

                  <div style={{ marginTop: 6 }}>
                     {normalizeAddress(
                        deliveryInfo.pickup.pickupInfo.organizationAddress
                     )}
                  </div>
               </DeliveryState>
               <DeliveryState
                  title="Drop Off"
                  value={deliveryInfo.dropoff.status.value}
                  time={deliveryInfo.dropoff.status.timeStamp}
               >
                  <div
                     style={{
                        display: 'flex',
                        alignItems: 'center',
                     }}
                  >
                     <Avatar
                        withName
                        title={`${deliveryInfo.dropoff.dropoffInfo.customerFirstName} ${deliveryInfo.dropoff.dropoffInfo.customerLastName}`}
                     />
                     &nbsp;&middot;&nbsp;
                     {deliveryInfo.dropoff.dropoffInfo.customerPhone || 'N/A'}
                  </div>
                  <div style={{ marginTop: 6 }}>
                     {normalizeAddress(
                        deliveryInfo.dropoff.dropoffInfo.customerAddress
                     )}
                  </div>
               </DeliveryState>
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

const DeliveryState = ({ title, value, time, children }) => {
   return (
      <StyledDeliveryCard>
         <section data-type="status">
            <span>
               <span>
                  {title}
                  <StyledTag status={value}>{STATUS[value]}</StyledTag>
               </span>
               <span>{time && formatDate(time)}</span>
            </span>
         </section>
         {children && <div>{children}</div>}
      </StyledDeliveryCard>
   )
}
