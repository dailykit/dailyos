import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

// Sections
import Header from './sections/Header'
import Main from './sections/Main'

// Styled
import { StyledWrapper } from './styled'
import { OrderSummary } from './components'

const App = () => {
   return (
      <StyledWrapper>
         <OrderSummary />
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
