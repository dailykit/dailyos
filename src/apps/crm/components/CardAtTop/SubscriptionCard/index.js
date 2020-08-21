import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'

const StyleCard = ({ active, heading, click, data }) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="subtitle">Subscription</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="subtitle">Total Skipped</Text>
               <Text as="title">{data?.skipped?.aggregate?.count || '0'}</Text>
            </span>
            <span>
               <Text as="subtitle">Total Orders</Text>
               <Text as="title">
                  {data?.ordered?.aggregate?.count || 'N/A'}
               </Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
