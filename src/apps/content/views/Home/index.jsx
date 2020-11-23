import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { INFO_COUNT, CONTENT_PAGE } from '../../graphql'
import { useTabs } from '../../context'
import { StyledCardList, StyledHome } from './styled'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../shared/components'
import { logger } from '../../../../shared/utils'

export const Home = () => {
   const { addTab } = useTabs()
   // const {
   //    loading,
   //    data: { content_informationGrid_aggregate = {} } = {},
   // } = useSubscription(INFO_COUNT)
   const { data: { content_page = [] } = {}, loading, error } = useSubscription(
      CONTENT_PAGE
   )
   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }
   return (
      <StyledHome>
         <h1>Content App</h1>
         <h2>Pages</h2>
         <StyledCardList>
            {content_page.map(page => {
               return (
                  <DashboardTile
                     title={
                        page.title.charAt(0).toUpperCase() + page.title.slice(1)
                     }
                     onClick={() =>
                        addTab(
                           'Identifiers',
                           `/content/${page.title}/identifiers`
                        )
                     }
                  />
               )
            })}
         </StyledCardList>
      </StyledHome>
   )
}
