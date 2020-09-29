import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

import { COLLECTIONS_COUNT } from '../../graphql'

const address = 'apps.online_store.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const { data: collectionsData } = useSubscription(COLLECTIONS_COUNT)

   return (
      <StyledHome>
         <h1>{t(address.concat('seller app'))}</h1>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat('collections'))}
               count={
                  collectionsData?.collectionsAggregate.aggregate.count || '...'
               }
               conf="All available"
               onClick={() =>
                  addTab('Collections', '/online-store/collections')
               }
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
