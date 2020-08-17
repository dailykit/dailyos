import React from 'react'
import { Text } from '@dailykit/ui'
import { StyledTile } from './styled'

const HeadingTile = props => {
   return (
      <StyledTile>
         <Text as="p">{props.title}</Text>
         <Text as="title">{props.value}</Text>
      </StyledTile>
   )
}

export default HeadingTile
