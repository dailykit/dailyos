import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'
const StyleCard = ({ active, heading, click }) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="p">Referrals</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="p">Referrals Sent</Text>
               <Text as="p">N/A</Text>
            </span>
            <span>
               <Text as="p">Total Signup</Text>
               <Text as="p">N/A</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
