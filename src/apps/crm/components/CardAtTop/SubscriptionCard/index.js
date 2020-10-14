import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'

const StyleCard = ({ active, heading, click, data }) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="p">Subscription</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="p">Total Skipped</Text>
               <Text as="p">{data?.skipped?.aggregate?.count || '0'}</Text>
            </span>
            <span>
               <Text as="p">Total Orders</Text>
               <Text as="p">{data?.ordered?.aggregate?.count || 'N/A'}</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
