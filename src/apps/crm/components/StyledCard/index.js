import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'

const StyleCard = ({
   active,
   heading,
   click,
   subheading1,
   subheading2,
   data,
}) => {
   return (
      <StyledCard active={active === heading}>
         <CardHeading>
            <Text as="subtitle">{heading}</Text>
            <ViewTab onClick={click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="subtitle">{subheading1}</Text>
               <Text as="title">{data?.sum?.amountPaid || 'N/A'}</Text>
            </span>
            <span>
               <Text as="subtitle">{subheading2}</Text>
               <Text as="title">{data?.count || 'N/A'}</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
