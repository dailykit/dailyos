import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { DashboardTile, Text } from '@dailykit/ui'

// State
import { useTabs } from '../../context/tabs'

import { StyledHome, StyledCardList } from './styled'

import { ORDER_AGGREGATE } from '../../graphql'

import { Loader } from '../../components'

const Home = () => {
   const { addTab } = useTabs()
   const { loading, error, data } = useSubscription(ORDER_AGGREGATE)

   if (loading)
      return (
         <StyledHome>
            <Loader />
         </StyledHome>
      )
   if (error) return <div>{error.message}</div>
   return (
      <StyledHome>
         <Text as="h1">Order App</Text>
         <StyledCardList>
            <DashboardTile
               title="Orders"
               conf="All available"
               count={data?.ordersAggregate?.aggregate?.count}
               onClick={() => addTab('Orders', '/order/orders')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
