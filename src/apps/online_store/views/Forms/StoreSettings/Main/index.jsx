import React from 'react'
import { Text } from '@dailykit/ui'

import { Container } from '../styled'
import { Fixed } from './styled'

import { BrandSettings, VisualSettings } from './components'

const Main = () => {
   return (
      <Container paddingX="32" left="300">
         <Fixed>
            <Text as="h1">Store Settings</Text>
         </Fixed>
         <Container top="32" bottom="32">
            <BrandSettings />
            <VisualSettings />
         </Container>
      </Container>
   )
}

export default Main
