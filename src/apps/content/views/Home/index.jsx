import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import {INFO_COUNT} from '../../graphql'
import { useTabs } from '../../context'
import { StyledCardList, StyledHome } from './styled'

export const Home = () => {
   const { addTab } = useTabs()
const { loading, data : { content_informationGrid_aggregate = {} } = {} } = useSubscription(INFO_COUNT)

   return (
      <StyledHome>
         <h1>Content App</h1>
         <StyledCardList>
            <DashboardTile
               title="Blocks"
               count={loading ? '...' : content_informationGrid_aggregate?.aggregate?.count }
               conf="All available"
               onClick={() => addTab('Information Blocks', '/content/blocks')}
            />
         </StyledCardList>
      </StyledHome>
   )
}
