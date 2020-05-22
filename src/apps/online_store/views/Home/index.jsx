import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList, StyledCard } from './styled'

import { useTranslation, Trans } from 'react-i18next'

import {
   COLLECTIONS_COUNT,
   SRP_COUNT,
   IP_COUNT,
   COP_COUNT,
   CUP_COUNT,
} from '../../graphql'

const address = 'apps.online_store.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }

   const { data: collectionsData } = useSubscription(COLLECTIONS_COUNT)
   const { data: simpleRecipeProductData } = useSubscription(SRP_COUNT)
   const { data: inventoryProductData } = useSubscription(IP_COUNT)
   const { data: comboProductData } = useSubscription(COP_COUNT)
   const { data: customizableProductData } = useSubscription(CUP_COUNT)

   return (
      <StyledHome>
         <h1>{t(address.concat('seller app'))}</h1>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat('collections'))}
               count={
                  collectionsData?.menuCollectionsAggregate.aggregate.count ||
                  '...'
               }
               conf="All available"
               onClick={() => addTab('Collections', 'collections')}
            />
            <DashboardTile
               title={t(address.concat('products'))}
               count={
                  simpleRecipeProductData?.simpleRecipeProductsAggregate
                     .aggregate.count +
                     inventoryProductData?.inventoryProductsAggregate.aggregate
                        .count +
                     customizableProductData?.customizableProductsAggregate
                        .aggregate.count +
                     comboProductData?.comboProductsAggregate.aggregate.count ||
                  '...'
               }
               conf="All available"
               onClick={() => addTab('Products', 'products')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
