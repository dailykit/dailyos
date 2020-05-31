import React from 'react'
import { Text } from '@dailykit/ui'

import { Container } from './styled'

const Main = () => {
   return (
      <Container paddingX="32">
         <Text as="h1">Store Settings</Text>
         <Container top="32" bottom="32"></Container>
      </Container>
   )
}

export default Main
