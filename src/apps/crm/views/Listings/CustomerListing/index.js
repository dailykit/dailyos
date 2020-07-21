import React from 'react'

import { StyledHeader, StyledPagination, StyledWrapper } from '../styled'

const CustomerListing = () => {
   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Customers</h1>
            <StyledPagination>Total: 10000</StyledPagination>
         </StyledHeader>
         <div>Heelo I am cusotmer listing</div>
      </StyledWrapper>
   )
}

export default CustomerListing
