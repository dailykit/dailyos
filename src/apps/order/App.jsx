import React from 'react'
import usePortal from 'react-useportal'
import { Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import { BrowserRouter as Router } from 'react-router-dom'

// Context
import { useOrder, useConfig } from './context'

// Sections
import Header from './sections/Header'
import Main from './sections/Main'
import Footer from './sections/Footer'

// Styled
import { StyledWrapper } from './styled'
import {
   OrderSummary,
   ProcessOrder,
   FilterTunnel,
   ConfigTunnel,
   DeliveryConfig,
   Notifications,
   ProcessInventory,
   ProcessReadyToEat,
} from './components'

const App = () => {
   const { state } = useOrder()
   const { state: configState } = useConfig()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [filterTunnels, openFilterTunnel, closeFilterTunnel] = useTunnel(1)
   const [configTunnels, openConfigTunnel, closeConfigTunnel] = useTunnel(1)
   const [position, setPosition] = React.useState('left')
   const { openPortal, closePortal, isOpen, Portal } = usePortal({
      bindTo: document && document.getElementById('notifications'),
   })

   React.useEffect(() => {
      if (state.delivery_config.orderId) {
         openTunnel(1)
      }
   }, [state.delivery_config, openTunnel])

   React.useEffect(() => {
      if (configState.tunnel.visible) {
         openConfigTunnel(1)
      } else {
         closeConfigTunnel(1)
      }
   }, [configState.tunnel.visible, openConfigTunnel, closeConfigTunnel])

   React.useEffect(() => {
      if (state.filter.tunnel) {
         openFilterTunnel(1)
      } else {
         closeFilterTunnel(1)
      }
   }, [state.filter.tunnel, openFilterTunnel, closeFilterTunnel])

   return (
      <StyledWrapper position={position}>
         {state.current_view === 'SUMMARY' && <OrderSummary />}
         {state.current_view === 'MEALKIT' && <ProcessOrder />}
         {state.current_view === 'INVENTORY' && <ProcessInventory />}
         {state.current_view === 'READYTOEAT' && <ProcessReadyToEat />}
         <Router>
            <main>
               <Header
                  isOpen={isOpen}
                  openPortal={openPortal}
                  closePortal={closePortal}
                  setPosition={setPosition}
               />
               <Main />
            </main>
         </Router>
         <Footer />
         {isOpen && (
            <Portal>
               <Notifications
                  isOpen={isOpen}
                  openPortal={openPortal}
                  closePortal={closePortal}
               />
            </Portal>
         )}
         <Portal>
            <Tunnels tunnels={tunnels}>
               <Tunnel layer="1" size="md">
                  <DeliveryConfig closeTunnel={closeTunnel} />
               </Tunnel>
            </Tunnels>
         </Portal>
         <Portal>
            <Tunnels tunnels={filterTunnels}>
               <Tunnel layer="1" size="sm">
                  <FilterTunnel />
               </Tunnel>
            </Tunnels>
         </Portal>
         <Portal>
            <Tunnels tunnels={configTunnels}>
               <Tunnel layer="1" size="full">
                  <ConfigTunnel />
               </Tunnel>
            </Tunnels>
         </Portal>
      </StyledWrapper>
   )
}

export default App
