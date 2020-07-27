/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledCard, CardHeading, CardContent, ViewTab } from './styled'
// import { RightIcon } from '../../../../shared/assets/icons'

const styledCard = props => (
   <StyledCard>
      <CardHeading>
         <Text as="subtitle">{props.heading}</Text>
         <ViewTab>view</ViewTab>
      </CardHeading>
      <CardContent>
         <span>
            <Text as="subtitle">{props.subheading1}</Text>
            <Text as="title">{props.value1}</Text>
         </span>
         <span>
            <Text as="subtitle">{props.subheading2}</Text>
            <Text as="title">{props.value2}</Text>
         </span>
      </CardContent>
   </StyledCard>
)
export default styledCard
