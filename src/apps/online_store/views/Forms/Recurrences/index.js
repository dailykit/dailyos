import React from 'react'

import { StyledLayout } from './styled'

import Sidebar from './Sidebar'
import Main from './Main'

const RecurrencesForm = () => {
   return (
      <StyledLayout>
         <Sidebar />
         <Main />
      </StyledLayout>
   )
}

export default RecurrencesForm
