import React from 'react'
import { DashboardTile } from '@dailykit/ui'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

const Home = () => {
   const { addTab } = useTabs()

   return (
      <StyledHome>
         <h1>CRM</h1>
         <StyledCardList>
            <DashboardTile
               title="Customers"
               count={10000}
               conf="All available"
               onClick={() => addTab('Customers', '/crm/customers')}
            />
            <DashboardTile
               title="Referral Plans"
               count={22}
               conf="All available"
               onClick={() => addTab('Referral Plans', '/crm/referral-plans')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
