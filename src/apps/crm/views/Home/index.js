import React from 'react'
import { DashboardTile, SearchBox, Text } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

// State
import { useTabs } from '../../context'
import { StyledHome, StyledCardList, StyledHeader } from './styled'
import { CUSTOMERS_COUNT } from '../../graphql'

const Home = () => {
   const { addTab } = useTabs()
   // const { t } = useTranslation()
   const { data: customersCount } = useSubscription(CUSTOMERS_COUNT)

   const [search, setSearch] = React.useState('')
   return (
      <StyledHome>
         <StyledHeader>
            <Text as="h1">Customer Relation Manager</Text>
            <SearchBox
               placeholder="Search"
               value={search}
               onChange={e => setSearch(e.target.value)}
            />
         </StyledHeader>

         <StyledCardList>
            <DashboardTile
               title="Customers"
               count={
                  customersCount?.customers_aggregate.aggregate.count || '...'
               }
               onClick={() => addTab('Customers', '/crm/customers')}
            />
            <DashboardTile
               title="Referral Plans"
               count={22}
               onClick={() => addTab('Referral Plans', '/crm/referral-plans')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
