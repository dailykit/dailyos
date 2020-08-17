import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { DashboardTile, Text, Loader } from '@dailykit/ui'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

export const Home = () => {
   const { addTab } = useTabs()

   return (
      <StyledHome>
         <Text as="h1">Subscription App</Text>
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
