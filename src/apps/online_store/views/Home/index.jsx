import React from 'react'
import { DashboardTile } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

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
   const { addTab } = useTabs()

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
               onClick={() =>
                  addTab('Collections', '/online-store/collections')
               }
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
               onClick={() => addTab('Products', '/online-store/products')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
