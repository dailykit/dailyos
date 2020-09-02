import React from 'react'

import { StyledHeader, StyledWrapper } from '../styled'
import { useInsights } from '../../hooks/useInsights'

const ReferralPlansListing = () => {
   const data = useInsights('e9b59cd3-7a22-426b-bd63-37ff70e76a45')

   console.log(data)

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>
      </StyledWrapper>
   )
}

export default ReferralPlansListing
