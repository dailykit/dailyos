import React, { useContext } from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { WEBSITE_TOTAL_PAGES } from '../../graphql'
import { useTabs } from '../../context'
import BrandContext from '../../context/Brand'
import { StyledCardList, StyledHome } from './styled'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../shared/components'
import { logger } from '../../../../shared/utils'

export const Home = () => {
   const { addTab } = useTabs()
   const [context, setContext] = useContext(BrandContext)
   const {
      data: {
         website_websitePage_aggregate: { aggregate: { count = 0 } = {} } = {},
      } = {},
      loading: totalPagesLoading,
      error: totalPagesError,
   } = useSubscription(WEBSITE_TOTAL_PAGES, {
      variables: {
         websiteId: context.websiteId,
      },
   })

   return (
      <StyledHome>
         <h1>Content App</h1>
         <StyledCardList>
            <DashboardTile
               title="Pages"
               count={count}
               onClick={() => addTab('Pages', `/content/pages`)}
            />
            <DashboardTile
               title="Settings"
               onClick={() => addTab('Settings', `/content/settings`)}
            />
            <DashboardTile
               title="Blocks"
               onClick={() => addTab('Blocks', `/content/blocks`)}
            />
         </StyledCardList>
      </StyledHome>
   )
}
