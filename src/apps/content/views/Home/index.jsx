import React from 'react'
import { DashboardTile } from '@dailykit/ui'

import { useTabs } from '../../context'
import { StyledCardList, StyledHome } from './styled'

export const Home = () => {
   const { addTab } = useTabs()

   return (
      <StyledHome>
         <h1>Content App</h1>
         <StyledCardList>
            <DashboardTile
               title="Blocks"
               count={0}
               conf="All available"
               onClick={() => addTab('Information Blocks', '/content/blocks')}
            />
         </StyledCardList>
      </StyledHome>
   )
}
