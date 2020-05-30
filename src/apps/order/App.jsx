import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

// Context
import { useOrder } from './context'

// Sections
import Header from './sections/Header'
import Main from './sections/Main'

// Styled
import { StyledWrapper } from './styled'
import { OrderSummary, ProcessOrder } from './components'

const App = () => {
   const { state } = useOrder()
   return (
      <StyledWrapper>
         {state.current_view === 'SUMMARY' && <OrderSummary />}
         {state.current_view === 'WEIGHING' && (
            <ProcessOrder id={state?.order?.id?.toString() || null} />
         )}
         <Router>
            <div>
               <Header />
               <Main />
            </div>
         </Router>
      </StyledWrapper>
   )
}

export default App
