import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'

const StyleCard = ({ active, heading, click, data }) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="p">Orders</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="p">Total Amount</Text>
               <Text as="p">{data?.sum?.amountPaid || 'N/A'}</Text>
            </span>
            <span>
               <Text as="p">Total Orders</Text>
               <Text as="p">{data?.count || 'N/A'}</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
