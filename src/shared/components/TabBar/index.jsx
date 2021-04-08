import React from 'react'
import { Flex } from '@dailykit/ui'
import Tabs from '../Tabs'
import Logo from './components/Logo'
import Styles from './styled'
import Tools from './components/Tools'

export const TabBar = () => {
   return (
      <Styles.Header>
         <Flex container alignItems="center">
            <Logo />
            <Tabs />
         </Flex>
         <Tools />
      </Styles.Header>
   )
}
