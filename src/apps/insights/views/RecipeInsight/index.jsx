import React from 'react'
import { StyledHeader, StyledWrapper } from '../styled'
import Insight from '../../components/Insight'

const ReferralPlansListing = () => {
   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>

         <Insight
            id="e9b59cd3-7a22-426b-bd63-37ff70e76a45"
            alignment="column"
            nodeKey="inventoryProducts"
            includeChart
            tablePosition="left"
            chartOptions={{
               width: '900px',
            }}
         />
      </StyledWrapper>
   )
}

export default ReferralPlansListing