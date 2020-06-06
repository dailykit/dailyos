import React from 'react'
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
   ProcessInventory,
   ProcessReadyToEat,
} from './components'

const App = () => {
   const { state } = useOrder()
   const [position, setPosition] = React.useState('left')
   if (position === 'left')
      return (
         <StyledWrapper position={position}>
            {state.current_view === 'SUMMARY' && <OrderSummary />}
            {state.current_view === 'MEALKIT' && <ProcessOrder />}
            {state.current_view === 'INVENTORY' && <ProcessInventory />}
            {state.current_view === 'READYTOEAT' && <ProcessReadyToEat />}
            <Router>
               <div>
                  <Header setPosition={setPosition} />
                  <Main />
               </div>
            </Router>
         </StyledWrapper>
      )
   return (
      <StyledWrapper position={position}>
         <Router>
            <div>
               <Header setPosition={setPosition} />
               <Main />
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
