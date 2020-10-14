import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'

const StyleCard = ({ active, heading, click }) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="p">Wallet</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="p">Total Wallet Amount</Text>
               <Text as="p">N/A</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
