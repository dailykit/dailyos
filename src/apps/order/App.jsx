import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

// Sections
import Header from './sections/Header'
import Sidebar from './sections/Sidebar'
import Main from './sections/Main'

// Styled
import { StyledWrapper } from './styled'

const App = () => {
   const [isSidebarVisible, toggleSidebar] = React.useState(false)
   return (
      <StyledWrapper>
         <Router>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar visible={isSidebarVisible} toggleSidebar={toggleSidebar} />
            <Main />
         </Router>
      </StyledWrapper>
   )
}

export default App
