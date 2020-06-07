import React from 'react'

import { Text } from '@dailykit/ui'
import { Container } from '../styled'

import { Recurrence } from './components'

const Main = ({ recurrences }) => {
   return (
      <Container
         left="250"
         position="fixed"
         height="100vh"
         style={{ overflowY: 'scroll', width: 'calc(100% - 250px)' }}
      >
         <Container
            paddingX="32"
            bg="#fff"
            position="fixed"
            width="100%"
            style={{ zIndex: '10' }}
         >
            <Text as="h1">Recurrences</Text>
         </Container>
         <Container paddingX="32" top="80" bottom="64">
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
