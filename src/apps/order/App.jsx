import React from 'react'
import usePortal from 'react-useportal'
import { Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import { BrowserRouter as Router } from 'react-router-dom'

// Context
import { useOrder } from './context'

// Sections
import Header from './sections/Header'
import Main from './sections/Main'

// Styled
import { StyledWrapper } from './styled'
import {
   OrderSummary,
   ProcessOrder,
   FilterTunnel,
   DeliveryConfig,
   Notifications,
   ProcessInventory,
   ProcessReadyToEat,
} from './components'

const App = () => {
   const { state } = useOrder()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [filterTunnels, openFilterTunnel, closeFilterTunnel] = useTunnel(1)
   const [position, setPosition] = React.useState('left')
   const { openPortal, closePortal, isOpen, Portal } = usePortal({
      bindTo: document && document.getElementById('notifications'),
   })

   React.useEffect(() => {
      if (state.delivery_config.orderId) {
         openTunnel(1)
      }
   }, [state.delivery_config])

   React.useEffect(() => {
      if (state.filter.tunnel) {
         openFilterTunnel(1)
      } else {
         closeFilterTunnel(1)
      }
   }, [state.filter.tunnel])

   if (position === 'left')
      return (
         <StyledWrapper position={position}>
            {state.current_view === 'SUMMARY' && <OrderSummary />}
            {state.current_view === 'MEALKIT' && <ProcessOrder />}
            {state.current_view === 'INVENTORY' && <ProcessInventory />}
            {state.current_view === 'READYTOEAT' && <ProcessReadyToEat />}
            <Router>
               <div>
                  <Header
                     isOpen={isOpen}
                     openPortal={openPortal}
                     closePortal={closePortal}
                     setPosition={setPosition}
                  />
                  <Main />
               </div>
               {isOpen && (
                  <Portal>
                     <Notifications
                        isOpen={isOpen}
                        openPortal={openPortal}
                        closePortal={closePortal}
                     />
                  </Portal>
               )}
            </Router>
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
         </StyledWrapper>
      )
   return (
      <StyledWrapper position={position}>
         <Portal>
            <Tunnels tunnels={tunnels}>
               <Tunnel layer="1" size="md">
                  <DeliveryConfig />
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
         <Router>
            <div>
               <Header
                  isOpen={isOpen}
                  openPortal={openPortal}
                  closePortal={closePortal}
                  setPosition={setPosition}
               />
               <Main />
               {isOpen && (
                  <Portal>
                     <Notifications
                        isOpen={isOpen}
                        openPortal={openPortal}
                        closePortal={closePortal}
                     />
                  </Portal>
               )}
            </div>
         </Router>
         {state.current_view === 'SUMMARY' && <OrderSummary />}
         {state.current_view === 'MEALKIT' && <ProcessOrder />}
         {state.current_view === 'INVENTORY' && <ProcessInventory />}
         {state.current_view === 'READYTOEAT' && <ProcessReadyToEat />}
      </StyledWrapper>
   )
}

export default App
