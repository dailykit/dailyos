import { Flex } from '@dailykit/ui'
import React from 'react'
import { useTabs } from '../../providers'

import Tabs from '../Tabs'
import Logo from './Logo'
import Styles from './styled'
import TabStatus from './TabStatus'

export const TabBar = () => {
   const { tabs } = useTabs()
   return (
      <Styles.Header>
         <Logo />
         {tabs.length ? <TabStatus /> : null}
         {/* <Tabs /> */}
      </Styles.Header>
   )
}
