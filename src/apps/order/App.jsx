import React from 'react'
import usePortal from 'react-useportal'
import { Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

// Context
import { useOrder, useConfig } from './context'

import Main from './sections/Main'
import Footer from './sections/Footer'

// Styled
import { StyledWrapper } from './styled'
import {
   OrderSummary,
   FilterTunnel,
   ConfigTunnel,
   ProcessSachet,
   DeliveryConfig,
   Notifications,
} from './components'

import { useTabs } from '../../shared/providers'
import { ErrorBoundary } from '../../shared/components'

const App = () => {
   const { state, dispatch } = useOrder()
   const { addTab, setRoutes } = useTabs()
   const { state: configState } = useConfig()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [filterTunnels, openFilterTunnel, closeFilterTunnel] = useTunnel(1)
   const [configTunnels, openConfigTunnel, closeConfigTunnel] = useTunnel(1)
   const [position, setPosition] = React.useState('left')
   const { openPortal, closePortal, isOpen, Portal } = usePortal({
      bindTo: document && document.getElementById('notifications'),
   })

   React.useEffect(() => {
      setRoutes([
         {
            id: 1,
            title: 'Home',
            onClick: () => addTab('Home', '/order'),
         },
         {
            id: 2,
            title: 'Orders',
            onClick: () => addTab('Orders', '/order/orders'),
         },
         {
            id: 3,
            title: 'Planned',
            onClick: () => addTab('Planned', '/order/planned'),
         },
      ])
   }, [])

   React.useEffect(() => {
      if (configState.current_station?.id) {
         dispatch({
            type: 'SET_FILTER',
            payload: {
               _or: [
                  {
                     orderInventoryProducts: {
                        assemblyStationId: {
                           _eq: configState.current_station?.id,
                        },
                     },
                  },
                  {
                     orderReadyToEatProducts: {
                        assemblyStationId: {
                           _eq: configState.current_station?.id,
                        },
                     },
                  },
                  {
                     orderMealKitProducts: {
                        _or: [
                           {
                              assemblyStationId: {
                                 _eq: configState.current_station?.id,
                              },
                           },
                           {
                              orderSachets: {
                                 packingStationId: {
                                    _eq: configState.current_station?.id,
                                 },
                              },
                           },
                        ],
                     },
                  },
               ],
            },
         })
      }
   }, [configState.current_station.id])

   React.useEffect(() => {
      if (state.delivery_config.orderId) {
         openTunnel(1)
      }
   }, [state.delivery_config])

   React.useEffect(() => {
      if (configState.tunnel.visible) {
         openConfigTunnel(1)
      } else {
         closeConfigTunnel(1)
      }
   }, [configState.tunnel.visible])

   React.useEffect(() => {
      if (state.filter.tunnel) {
         openFilterTunnel(1)
      } else {
         closeFilterTunnel(1)
      }
   }, [state.filter.tunnel])

   return (
      <StyledWrapper position={position}>
         <ErrorBoundary rootRoute="/apps/order">
            {state.current_view === 'SUMMARY' && <OrderSummary />}
            {state.current_view === 'SACHET_ITEM' && <ProcessSachet />}
         </ErrorBoundary>
         <Main />
         <Footer
            isOpen={isOpen}
            openPortal={openPortal}
            closePortal={closePortal}
            setPosition={setPosition}
         />
         {isOpen && (
            <Portal>
               <Notifications
                  isOpen={isOpen}
                  openPortal={openPortal}
                  closePortal={closePortal}
               />
            </Portal>
         )}
         <ErrorBoundary rootRoute="/apps/order">
            <Tunnels tunnels={tunnels}>
               <Tunnel layer="1" size="md">
                  <DeliveryConfig closeTunnel={closeTunnel} />
               </Tunnel>
            </Tunnels>
         </ErrorBoundary>
         <ErrorBoundary rootRoute="/apps/order">
            <Tunnels tunnels={filterTunnels}>
               <Tunnel layer="1" size="sm">
                  <FilterTunnel />
               </Tunnel>
            </Tunnels>
         </ErrorBoundary>
         <ErrorBoundary rootRoute="/apps/order">
            <Tunnels tunnels={configTunnels}>
               <Tunnel layer="1" size="full">
                  <ConfigTunnel />
               </Tunnel>
            </Tunnels>
         </ErrorBoundary>
      </StyledWrapper>
   )
}

export default App
