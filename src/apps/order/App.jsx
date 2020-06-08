import React from 'react'
import usePortal from 'react-useportal'
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
   Notifications,
   ProcessInventory,
   ProcessReadyToEat,
} from './components'

const App = () => {
   const { state } = useOrder()
   const [position, setPosition] = React.useState('left')
   const { openPortal, closePortal, isOpen, Portal } = usePortal({
      bindTo: document && document.getElementById('notifications'),
   })

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
         </StyledWrapper>
      )
   return (
      <StyledWrapper position={position}>
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
