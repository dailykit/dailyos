import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'

const StyleCard = ({ active, heading, click }) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="subtitle">Referrals</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="subtitle">Total Referrals Sent</Text>
               <Text as="title">N/A</Text>
            </span>
            <span>
               <Text as="subtitle">Total Signed Up</Text>
               <Text as="title">N/A</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
