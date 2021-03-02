import React, { useContext } from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { WEBSITE_TOTAL_PAGES } from '../../graphql'
import BrandContext from '../../context/Brand'
import { StyledCardList, StyledHome } from './styled'
import { InlineLoader } from '../../../../shared/components'
import { logger } from '../../../../shared/utils'
import { useTabs } from '../../../../shared/providers'

export const Home = () => {
   const { addTab } = useTabs()
   const [context, setContext] = useContext(BrandContext)
   const {
      data: {
         website_websitePage_aggregate: { aggregate: { count = 0 } = {} } = {},
      } = {},
      loading,
      error,
   } = useSubscription(WEBSITE_TOTAL_PAGES, {
      variables: {
         websiteId: context.websiteId,
      },
   })
   if (loading) {
      return <InlineLoader />
   }
   if (error) {
      toast.error('Something Went Wrong!')
      logger(error)
   }

   return (
      <StyledHome>
         <h1>Content App</h1>
         <StyledCardList>
            <DashboardTile
               title="Pages"
               count={count}
               onClick={() => addTab('Pages', '/content/pages')}
            />
            <DashboardTile
               title="Settings"
               onClick={() => addTab('Settings', '/content/settings')}
            />
            <DashboardTile
               title="Blocks"
               onClick={() => addTab('Blocks', '/content/blocks')}
            />
         </StyledCardList>
      </StyledHome>
   )
}
