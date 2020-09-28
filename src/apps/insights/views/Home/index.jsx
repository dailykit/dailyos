import React from 'react'
import { Text, DashboardTile } from '@dailykit/ui'

// State
import { StyledHome, StyledCardList, StyledHeader } from './styled'
import { useTabs } from '../../context'

const Home = () => {
   const { addTab } = useTabs()

   return (
      <StyledHome>
         <StyledHeader>
            <Text as="h1">Insights</Text>
         </StyledHeader>

         <StyledCardList>
            <DashboardTile
               title="Recipe Insights"
               count={22}
               onClick={() => addTab('Recipe Insights', '/insights/recipe')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
