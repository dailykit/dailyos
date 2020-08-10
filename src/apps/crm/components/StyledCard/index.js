/* eslint-disable import/imports-first */
/* eslint-disable import/order */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'
// import { RightIcon } from '../../../../shared/assets/icons'

const StyleCard = props => {
   return (
      <StyledCard active={props.active === props.heading}>
         <CardHeading>
            <Text as="subtitle">{props.heading}</Text>
            <ViewTab onClick={props.click}>view</ViewTab>
         </CardHeading>
         <CardContent>
            <span>
               <Text as="subtitle">{props.subheading1}</Text>
               <Text as="title">{props?.data?.sum?.amountPaid || 'N/A'}</Text>
            </span>
            <span>
               <Text as="subtitle">{props.subheading2}</Text>
               <Text as="title">{props?.data?.count || 'N/A'}</Text>
            </span>
         </CardContent>
      </StyledCard>
   )
}
export default StyleCard
