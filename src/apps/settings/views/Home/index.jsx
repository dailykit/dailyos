import React from 'react'

import { DashboardTile, Text } from '@dailykit/ui'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

const Home = () => {
   const { addTab } = useTabs()
   return (
      <StyledHome>
         <Text as="h1">Settings App</Text>
         <StyledCardList>
            <DashboardTile
               title="Users"
               count="23"
               conf="All available"
               onClick={() => addTab('Users', '/settings/users')}
            />
            <DashboardTile
               title="Roles"
               count="4"
               conf="All available"
               onClick={() => addTab('Roles', '/settings/roles')}
            />
            <DashboardTile
               title="Apps"
               count="6"
               conf="All available"
               onClick={() => addTab('Apps', '/settings/apps')}
            />
            <DashboardTile
               title="Devices"
               count="4"
               conf="All active"
               onClick={() => addTab('Devices', '/settings/devices')}
            />
            <DashboardTile
               title="Stations"
               count="4"
               conf="All active"
               onClick={() => addTab('Stations', '/settings/stations')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
