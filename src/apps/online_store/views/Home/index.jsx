import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList, StyledCard } from './styled'

import { useTranslation, Trans } from 'react-i18next'

import { COLLECTIONS } from '../../graphql'

const address = 'apps.online_store.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }

   const { data: collectionsData } = useSubscription(COLLECTIONS)

   return (
      <StyledHome>
         <h1>{t(address.concat('seller app'))}</h1>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat('collections'))}
               count={collectionsData?.menuCollections.length || '...'}
               conf="All available"
               onClick={() => addTab('Collections', 'collections')}
            />
            <DashboardTile
               title={t(address.concat('products'))}
               count={'...'}
               conf="All available"
               onClick={() => addTab('Products', 'products')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
