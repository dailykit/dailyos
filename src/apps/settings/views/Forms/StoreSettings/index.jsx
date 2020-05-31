import React from 'react'

import SideNav from './SideNav'
import Main from './Main'

import { StyledLayout } from './styled'

const StoreSettingsForm = () => {
   return (
      <StyledLayout>
         <SideNav />
         <Main />
      </StyledLayout>
   )
}

export default StoreSettingsForm
