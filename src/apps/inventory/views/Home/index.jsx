import { DashboardTile } from '@dailykit/ui'
import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { Context } from '../../context/tabs'
import { StyledHome, StyledTileContainer } from './styled'

const address = 'apps.inventory.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledHome>
         <h1>{t(address.concat('inventory app'))}</h1>
         <StyledTileContainer>
            <DashboardTile
               title={t(address.concat('suppliers'))}
               count="29"
               conf="All available"
               onClick={() => addTab('Suppliers', 'suppliers')}
            />
            <DashboardTile
               title={t(address.concat('items'))}
               count="29"
               conf="All available"
               onClick={() => addTab('Supplier Items', 'items')}
            />
            <DashboardTile
               title={t(address.concat('work orders'))}
               count="29"
               conf="All available"
               onClick={() => addTab('Work Orders', 'orders')}
            />
            <DashboardTile
               title={t(address.concat('purchase orders'))}
               count="29"
               conf="All available"
               onClick={() => addTab('Purchase Orders', 'purchaseOrders')}
            />
            <DashboardTile
               title="Packagings"
               count="29"
               conf="All available"
               onClick={() => addTab('Packagings', 'packagings')}
            />
         </StyledTileContainer>
      </StyledHome>
   )
}

export default Home
