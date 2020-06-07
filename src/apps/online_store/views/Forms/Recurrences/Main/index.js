import React from 'react'

import { Text } from '@dailykit/ui'
import { Container } from '../styled'

import { Recurrence } from './components'

const Main = () => {
   return (
      <Container left="300">
         <Container paddingX="32" bg="#fff">
            <Text as="h1">Recurrences</Text>
         </Container>
         <Container paddingX="32" top="40">
            <Recurrence />
         </Container>
      </Container>
   )
}

export default Main
