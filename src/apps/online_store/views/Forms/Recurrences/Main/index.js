import React from 'react'

import { Text } from '@dailykit/ui'
import { Container } from '../styled'

import { Recurrence } from './components'

const Main = ({ recurrences }) => {
   return (
      <Container left="300">
         <Container paddingX="32" bg="#fff">
            <Text as="h1">Recurrences</Text>
         </Container>
         <Container paddingX="32" top="40">
            {recurrences?.map((recurrence, index) => (
               <Recurrence
                  key={recurrence.id}
                  recurrence={recurrence}
                  index={index}
               />
            ))}
         </Container>
      </Container>
   )
}

export default Main
