import React from 'react'
import { DashboardTile, Text, Flex } from '@dailykit/ui'

import { useTabs } from '../../context'
import { StyledHome, StyledCardList } from './styled'
import { Tooltip } from '../../../../shared/components'

export const Home = () => {
   const { addTab } = useTabs()

   return (
      <StyledHome>
         <Flex container alignItems="center">
            <Text as="h1">Subscription App</Text>
            <Tooltip identifier="app_subscription_heading" />
         </Flex>
         <StyledCardList>
            <DashboardTile
               title="Menu"
               count="0"
               conf=""
               onClick={() => addTab('Menu', '/subscription/menu')}
            />
            <DashboardTile
               title="Subscriptions"
               count="0"
               conf=""
               onClick={() =>
                  addTab('Subscriptions', '/subscription/subscriptions')
               }
            />
         </StyledCardList>
      </StyledHome>
   )
}
